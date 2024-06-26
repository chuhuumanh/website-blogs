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

@Module({
    imports: [TypeOrmModule.forFeature([Activity, Actions, Posts, Comments, Category, Tags])],
    providers: [ActivityService, DatetimeService, ActionService, PostService, CategoryService, TagService],
    controllers: [ActivityController]
})
export class ActivityModule {}
