import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role, ROLES_KEY } from './role.decorator';

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
