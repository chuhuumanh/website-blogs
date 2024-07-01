import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Activity } from "./activity";
import { Comments } from "./comments";
import { PostModule } from "src/post/post.module";
import { ActionModule } from "src/action/action.module";
import { NotificationModule } from "src/notification/notification.module";
import { ActivityService } from "./activity.service";
import { DatetimeService } from "src/datetime/datetime.service";
import { APP_GUARD } from "@nestjs/core";
import { RoleGuard } from "src/role/role.guard";
import { ActivityController } from "./activity.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Activity, Comments]), PostModule, ActionModule, NotificationModule],
    providers: [ActivityService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [ActivityController],
    exports: [ActivityService]
})
export class ActivityModule {}