import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./jwt.constant";
import { AuthService} from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/user/users";
import { UserService } from "src/user/user.service";

@Module({
  imports: [ TypeOrmModule.forFeature([Users]),
            JwtModule.register({
              global: true,
              secret: jwtConstants.secret
    })],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}