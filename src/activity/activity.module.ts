import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Activity } from "./activity.entity";
import { PostModule } from "src/post/post.module";
import { ActionModule } from "src/action/action.module";
import { NotificationModule } from "src/notification/notification.module";
import { ActivityService } from "./activity.service";
import { DatetimeService } from "src/datetime/datetime.service";
import { ActivityController } from "./activity.controller";
import { ActivityGateway } from './activity.gateway';
import { WsConnectionAuth } from "src/auth/ws.connection.auth.guard";
import { AuthModule } from "src/auth/auth.module";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([Activity]), ActionModule, NotificationModule, forwardRef(() => AuthModule), forwardRef(() => PostModule)],
    providers: [ActivityService, DatetimeService, ActivityGateway, JwtService],
    controllers: [ActivityController],
    exports: [ActivityService]
})
export class ActivityModule {}