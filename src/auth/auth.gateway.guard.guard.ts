import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constant';
import { Socket } from 'dgram';

@Injectable()
export class AuthGuardGateWay implements CanActivate {
  constructor(private jwtService: JwtService){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient()
        const token = this.extractTokenFromHeader(client);
        if(!token)
            throw new UnauthorizedException();

        try{
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret
            });
            client['user'] = payload;
        }
        catch{
            throw new UnauthorizedException();
        }
        return true;
  }
  extractTokenFromHeader(client: Socket): string | undefined{
    try{
      const[type, token] = client['handshake'].headers.authorization.split(' ')??[];
        return type === 'Bearer' ? token : undefined;
    }
    catch{
      throw new BadRequestException('Token required !');
    }
    
  }
}
