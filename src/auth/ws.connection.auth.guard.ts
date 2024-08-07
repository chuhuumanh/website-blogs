import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'dgram';
import { AuthService } from './auth.service';

@Injectable()
export class WsConnectionAuth {
  constructor(private jwtService: JwtService, private configService: ConfigService, @Inject(forwardRef(() => AuthService)) private authService: AuthService){}

  async canActivate(client: Socket): Promise<boolean> {
        const token = this.extractTokenFromHeader(client);
        if(!token)
            return false;
        if(await this.isTokenInBlackList(token))
          throw new UnauthorizedException('Token expired !');
        try{
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWTCONSTANT')
            });
            client['user'] = payload;
        }
        catch{
            return false;
        }
        return true;
  }
  extractTokenFromHeader(client: Socket): string | undefined{
    try{
      const[type, token] = client['handshake'].headers.authorization.split(' ')??[];
        return type === 'Bearer' ? token : undefined;
    }
    catch{
      return null;
    }
  }
  async isTokenInBlackList(token: string){
    return await this.authService.findTokenBlackList(token);
  }
}
