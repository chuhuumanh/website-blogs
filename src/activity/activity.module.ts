import { Module, forwardRef } from "@nestjs/common";
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
import { ActivityGateway } from './activity.gateway';
import { AuthGuard } from "src/auth/auth.guard";
import { ParseFormDataPipe } from "src/validation/parse.formdata.pipe";
import { ValidationPipe } from "src/validation/validation.pipe";
import { RoleModule } from "src/role/role.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Activity, Comments]), forwardRef(() => PostModule), ActionModule, NotificationModule, RoleModule, AuthModule],
    providers: [ActivityService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}, ActivityGateway],
    controllers: [ActivityController],
    exports: [ActivityService]
})
export class ActivityModule {}