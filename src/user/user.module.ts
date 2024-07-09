import { Module, BadRequestException, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from 'src/activity/activity.module';
import { CategoryModule } from 'src/category/category.module';
import { FriendModule } from 'src/friend/friend.module';
import { ImageModule } from 'src/image/image.module';
import { NotificationModule } from 'src/notification/notification.module';
import { PostModule } from 'src/post/post.module';
import { TagModule } from 'src/tag/tag.module';
import { Users } from './users.entity';
import { DatetimeService } from 'src/datetime/datetime.service';
import { UserService } from './user.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { UserController } from './user.controller';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports: [TypeOrmModule.forFeature([Users]), PostModule, CategoryModule, TagModule, forwardRef(() => ImageModule), 
    ActivityModule, forwardRef(() => FriendModule) ,
    NotificationModule, RoleModule, AuthModule],
    exports: [UserService],
    providers: [UserService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [UserController]
})
export class UserModule {}