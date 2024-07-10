import { Module, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActionModule } from "src/action/action.module";
import { NotificationModule } from "src/notification/notification.module";
import { PostModule } from "src/post/post.module";
import { ActivityController } from "./activity.controller";
import { Activity } from "./activity.entity";
import { ActivityGateway } from './activity.gateway';
import { ActivityService } from "./activity.service";

@Module({
    imports: [TypeOrmModule.forFeature([Activity]), ActionModule, NotificationModule, forwardRef(() => PostModule)],
    providers: [ActivityService, ActivityGateway, JwtService],
    controllers: [ActivityController],
    exports: [ActivityService]
})
export class ActivityModule {}