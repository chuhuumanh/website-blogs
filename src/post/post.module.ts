import { BadRequestException, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionModule } from 'src/action/action.module';
import { ActivityModule } from 'src/activity/activity.module';
import { CategoryModule } from 'src/category/category.module';
import { ImageModule } from 'src/image/image.module';
import { UserModule } from 'src/user/user.module';
import { Posts } from './posts.entity';
import { PostService } from './post.service';
import { DatetimeService } from 'src/datetime/datetime.service';
import { PostController } from './post.controller';
import { TagModule } from 'src/tag/tag.module';
import { NotificationModule } from 'src/notification/notification.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([Posts]), forwardRef(() => AuthModule), CategoryModule, TagModule, forwardRef(() => UserModule), forwardRef(() => ActivityModule), ActionModule,
        forwardRef(() => ImageModule), NotificationModule],
    providers: [PostService, DatetimeService, JwtService],
    controllers: [PostController],
    exports: [PostService]
})
export class PostModule {}