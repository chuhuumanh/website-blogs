import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from 'src/activity/activity.module';
import { FriendModule } from 'src/friend/friend.module';
import { ImageModule } from 'src/image/image.module';
import { NotificationModule } from 'src/notification/notification.module';
import { PostModule } from 'src/post/post.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Users } from './users.entity';
import { LoggerModule } from 'src/logger/logger.module';
@Module({
    imports: [TypeOrmModule.forFeature([Users]), forwardRef(() => PostModule), forwardRef(() => FriendModule), 
        forwardRef(() => NotificationModule), forwardRef(() => ActivityModule), forwardRef(() => ImageModule),
        LoggerModule],
    exports: [UserService],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}