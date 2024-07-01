import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actions } from 'src/entity/actions';
import { ActionService } from 'src/services/action.service';
import { FriendModule } from './friend.module';
import { NotificationModule } from './notification.module';


@Module({
    imports: [TypeOrmModule.forFeature([Actions]), FriendModule, NotificationModule],
    providers: [ActionService]
})
export class ActionModule {}