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
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { PostController } from './post.controller';
import { TagModule } from 'src/tag/tag.module';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
    imports: [forwardRef(() => ImageModule), TypeOrmModule.forFeature([Posts]), forwardRef(() => ActivityModule), 
            CategoryModule, ActionModule, 
            TagModule, forwardRef(() => UserModule), 
            RoleModule, AuthModule, NotificationModule],
    providers: [PostService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [PostController],
    exports: [PostService]
})
export class PostModule {}