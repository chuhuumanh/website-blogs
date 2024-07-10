import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionModule } from 'src/action/action.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { FriendController } from './friend.controller';
import { FriendGateway } from './friend.gateway';
import { FriendService } from './friend.service';
import { Friends } from './friends.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Friends]), forwardRef(() => UserModule), ActionModule, NotificationModule],
    providers: [FriendService, FriendGateway],
    controllers: [FriendController],
    exports: [FriendService]
})
export class FriendModule {}