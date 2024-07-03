import { CanActivate, ExecutionContext, ForbiddenException, HttpCode, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.decorator';
import { ROLES_KEY } from './role.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService, private configService: ConfigService){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const user  = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(user);
    try{
      const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWTCONSTANT')
      });
      const profile = JSON.parse(payload.profile)
      return requiredRoles.some((role) => profile.role.name?.includes(role));
    }
    catch(error){
      throw new UnauthorizedException();
    }
  }
  extractTokenFromHeader(request: Request): string | undefined{
    const[type, token] = request.headers.authorization?.split(' ')??[];
    return type === 'Bearer' ? token : undefined;
}
}
