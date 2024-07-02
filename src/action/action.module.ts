import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actions } from './actions';
import { FriendModule } from 'src/friend/friend.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ActionService } from './action.service';


@Module({
    imports: [TypeOrmModule.forFeature([Actions])],
    providers: [ActionService],
    exports: [ActionService]
})
export class ActionModule {}