import { forwardRef, Module } from "@nestjs/common";
import { JwtModule, JwtService} from "@nestjs/jwt";
import { AuthService} from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenBlackList } from "./token.blacklist.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WsConnectionAuth } from "./ws.connection.auth.guard";
import { UserModule } from "src/user/user.module";
import { RoleModule } from "src/role/role.module";
import { CategoryModule } from "src/category/category.module";
import { TagModule } from "src/tag/tag.module";
import { PostModule } from "src/post/post.module";

@Module({
  imports: [TypeOrmModule.forFeature([TokenBlackList]),
            JwtModule.registerAsync({
              imports: [ConfigModule],
              useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWTCONSTANT')
              }), inject: [ConfigService]  
    }), forwardRef(() => UserModule), forwardRef(() => PostModule), forwardRef(() => RoleModule)],
  providers: [AuthService, WsConnectionAuth],
  controllers: [AuthController],
  exports: [AuthService, WsConnectionAuth]
})
export class AuthModule {}