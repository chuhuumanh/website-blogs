import { Module, BadRequestException, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from 'src/activity/activity.module';
import { CategoryModule } from 'src/category/category.module';
import { FriendModule } from 'src/friend/friend.module';
import { ImageModule } from 'src/image/image.module';
import { NotificationModule } from 'src/notification/notification.module';
import { PostModule } from 'src/post/post.module';
import { Users } from './users.entity';
import { DatetimeService } from 'src/datetime/datetime.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
@Module({
    imports: [TypeOrmModule.forFeature([Users]), forwardRef(() => AuthModule), forwardRef(() => PostModule), forwardRef(() => FriendModule), 
        forwardRef(() => NotificationModule), forwardRef(() => ActivityModule), forwardRef(() => ImageModule)],
    exports: [UserService],
    providers: [UserService, DatetimeService, JwtService, {provide: APP_GUARD, useClass: RoleGuard}],
    controllers: [UserController]
})
export class UserModule {}