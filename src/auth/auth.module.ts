import { forwardRef, Global, Module } from "@nestjs/common";
import { JwtModule, JwtService} from "@nestjs/jwt";
import { AuthService} from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenBlackList } from "./token.blacklist.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WsConnectionAuth } from "./ws.connection.auth.guard";
import { UserModule } from "src/user/user.module";
import { AuthGuard } from "./auth.guard";
import { RoleModule } from "src/role/role.module";

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