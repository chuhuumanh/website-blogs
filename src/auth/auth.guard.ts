import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlackList } from './token.blacklist';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService, private authService: AuthService){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token)
            throw new UnauthorizedException();

        if(await this.isTokenInBlackList(token))
            throw new UnauthorizedException('Token expired !');
        try{
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWTCONSTANT')
            });
            request['user'] = payload;
        }
        catch{
            throw new UnauthorizedException();
        }
        return true;
  }
    extractTokenFromHeader(request: Request): string | undefined{
        try{
            const[type, token] = request.headers.authorization.split(' ')??[];
            return type === 'Bearer' ? token : undefined;
        }
        catch{
            throw new BadRequestException('Token is required')
        }
    }

    async isTokenInBlackList(token: string){
        return await this.authService.findTokenBlackList(token);
    }
}
