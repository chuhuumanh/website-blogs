import { CanActivate, ExecutionContext, ForbiddenException, HttpCode, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.decorator';
import { ROLES_KEY } from './role.decorator';
import { Request, response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constant';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService){}
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
          secret: jwtConstants.secret
      });
      const profile = JSON.parse(payload.profile)
      return requiredRoles.some((role) => profile.role.name?.includes(role));
    }
    catch(error){
      throw new UnauthorizedException("JWT Expired");
    }
  }
  extractTokenFromHeader(request: Request): string | undefined{
    const[type, token] = request.headers.authorization?.split(' ')??[];
    return type === 'Bearer' ? token : undefined;
}
}
