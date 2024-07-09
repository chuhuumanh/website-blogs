import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthService} from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { TokenBlackList } from "./token.blacklist.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WsConnectionAuth } from "./ws.connection.auth.guard";
import { RoleService } from "src/role/role.service";
import { Users } from "src/user/users.entity";
import { Roles } from "src/role/roles.entity";
@Module({
  imports: [ TypeOrmModule.forFeature([Users, TokenBlackList, Roles]),
            JwtModule.registerAsync({
              imports: [ConfigModule],
              useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWTCONSTANT')
              }), inject: [ConfigService]  
    })],
  providers: [AuthService, UserService, WsConnectionAuth, RoleService],
  controllers: [AuthController],
  exports: [AuthService, WsConnectionAuth]
})
export class AuthModule {}