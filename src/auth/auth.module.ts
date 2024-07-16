import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
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
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CacheKeysInterceptor } from "src/interceptor/cache.interceptor";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TokenBlackList]),
            JwtModule.registerAsync({
              imports: [ConfigModule],
              useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWTCONSTANT')
              }), inject: [ConfigService]  
    }), CacheModule.registerAsync({
            useFactory: async (configService: ConfigService) =>({
                isGlobal: true,
                max: +configService.get<number>('CACHE_MAX'),
                ttl: +configService.get<number>('CACHE_TTL')
            }), inject: [ConfigService]
    }),
     forwardRef(() => UserModule), RoleModule],
  providers: [AuthService, WsConnectionAuth, {provide: APP_INTERCEPTOR, useClass: CacheKeysInterceptor}],
  controllers: [AuthController],
  exports: [AuthService, WsConnectionAuth, JwtModule, CacheModule]
})
export class AuthModule {}