import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from 'src/controllers/activity.controller';
import { Activity } from 'src/entity/activity';
import { ActivityService } from 'src/services/activity.service';
import { DatetimeService } from 'src/services/datetime.service';
import { ActionModule } from './action.module';
import { ActionService } from 'src/services/action.service';
import { Actions } from 'src/entity/actions';
import { Posts } from 'src/entity/posts';
import { PostService } from 'src/services/post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Activity]), TypeOrmModule.forFeature([Actions]), TypeOrmModule.forFeature([Posts])],
    providers: [ActivityService, DatetimeService, ActionService, PostService],
    controllers: [ActivityController]
})
export class ActivityModule {}
