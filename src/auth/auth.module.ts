import { forwardRef, Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleModule } from "src/role/role.module";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TokenBlackList } from "./token.blacklist.entity";
import { WsConnectionAuth } from "./ws.connection.auth.guard";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TokenBlackList]),
            JwtModule.registerAsync({
              imports: [ConfigModule],
              useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWTCONSTANT')
              }), inject: [ConfigService]  
    }), forwardRef(() => UserModule), RoleModule],
  providers: [AuthService, WsConnectionAuth, JwtModule],
  controllers: [AuthController],
  exports: [AuthService, WsConnectionAuth, JwtModule]
})
export class AuthModule {}