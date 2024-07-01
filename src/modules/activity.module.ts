import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from 'src/controllers/activity.controller';
import { Activity } from 'src/entity/activity';
import { ActivityService } from 'src/services/activity.service';
import { DatetimeService } from 'src/services/datetime.service';
import { ActionService } from 'src/services/action.service';
import { Actions } from 'src/entity/actions';
import { Posts } from 'src/entity/posts';
import { PostService } from 'src/services/post.service';
import { Comments } from 'src/entity/comments';
import { Category } from 'src/entity/category';
import { CategoryService } from 'src/services/category.service';
import { Tags } from 'src/entity/tags';
import { TagService } from 'src/services/tag.service';
import { UserService } from 'src/services/user.service';
import { Users } from 'src/entity/users';
import { NotificationService } from 'src/services/notification.service';
import { Notifications } from 'src/entity/notifications';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';
import { PostModule } from './post.module';
import { ActionModule } from './action.module';
import { NotificationModule } from './notification.module';

@Module({
    imports: [TypeOrmModule.forFeature([Activity, Comments]), PostModule, ActionModule, NotificationModule],
    providers: [ActivityService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [ActivityController]
})
export class ActivityModule {}