import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthService} from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/user/users";
import { UserService } from "src/user/user.service";
import { TokenBlackList } from "./token.blacklist";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WsConnectionAuth } from "./ws.connection.auth.guard";

@Module({
  imports: [ TypeOrmModule.forFeature([Users, TokenBlackList]),
            JwtModule.registerAsync({
              imports: [ConfigModule],
              useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWTCONSTANT')
              }), inject: [ConfigService]  
    })],
  providers: [AuthService, UserService, WsConnectionAuth],
  controllers: [AuthController],
  exports: [AuthService, WsConnectionAuth]
})
export class AuthModule {}