import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionModule } from 'src/action/action.module';
import { ActivityModule } from 'src/activity/activity.module';
import { CategoryModule } from 'src/category/category.module';
import { ImageModule } from 'src/image/image.module';
import { NotificationModule } from 'src/notification/notification.module';
import { TagModule } from 'src/tag/tag.module';
import { UserModule } from 'src/user/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Posts } from './posts.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Posts]), CategoryModule, TagModule, forwardRef(() => UserModule), forwardRef(() => ActivityModule), ActionModule,
        forwardRef(() => ImageModule), NotificationModule],
    providers: [PostService],
    controllers: [PostController],
    exports: [PostService]
})
export class PostModule {}