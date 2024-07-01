import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt.constant';
import { Request } from 'express';
import { any } from 'zod';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'dgram';

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private jwtService: JwtService){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient() as Socket;
        const token = this.extractTokenFromHeader(client);
        if(!token)
            await this.delay(10000, client);
            client.disconnect();
        try{
             await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret
            });
        }
        catch{
            await this.delay(10000, client);
            client.disconnect();
        }
        return true;
  }
  extractTokenFromHeader(request: Socket): string | undefined{
        const[type, token] = request['handshake'].headers.authorization.split(' ')??[];
        return type === 'Bearer' ? token : undefined;
    }
    delay(ms: number, client: Socket): Promise<any>{
        return new Promise(resolve => {
            client.emit('notifications', JSON.stringify({message: "Unauthorize"}));
            setTimeout(resolve, ms);
        })
    }
}
