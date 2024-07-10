import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendService } from './friend.service';
import { DatetimeService } from 'src/datetime/datetime.service';
import { Friends } from './friends.entity';
import { FriendController } from './friend.controller';
import { FriendGateway } from './friend.gateway';
import { UserModule } from 'src/user/user.module';
import { ActionModule } from 'src/action/action.module';
import { NotificationModule } from 'src/notification/notification.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';


@Module({
    imports: [TypeOrmModule.forFeature([Friends]), forwardRef(() => UserModule), ActionModule, NotificationModule, forwardRef(() => AuthModule)],
    providers: [FriendService, DatetimeService, FriendGateway, JwtService],
    controllers: [FriendController],
    exports: [FriendService]
})
export class FriendModule {}