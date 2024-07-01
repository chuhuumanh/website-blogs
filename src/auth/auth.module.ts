import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./jwt.constant";
import { TagModule } from "src/tag/tag.module";
import { CategoryModule } from "src/category/category.module";
import { PostModule } from "src/post/post.module";
import { ActivityModule } from "src/activity/activity.module";
import { ImageModule } from "src/image/image.module";
import { FriendModule } from "src/friend/friend.module";
import { AuthService} from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [ UserModule, TagModule,CategoryModule,PostModule,
            ActivityModule, ImageModule, FriendModule,
            JwtModule.register({
              global: true,
              secret: jwtConstants.secret
    })],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}