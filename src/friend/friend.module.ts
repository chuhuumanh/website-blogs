import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { FriendService } from './friend.service';
import { DatetimeService } from 'src/datetime/datetime.service';
import { Friends } from './friends.entity';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { FriendController } from './friend.controller';
import { FriendGateway } from './friend.gateway';
import { NotificationModule } from 'src/notification/notification.module';
import { ActionModule } from 'src/action/action.module';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Friends]), forwardRef(() => UserModule), forwardRef(() => NotificationModule), ActionModule, RoleModule, AuthModule],
    providers: [FriendService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}, FriendGateway],
    controllers: [FriendController],
    exports: [FriendService]
})
export class FriendModule {}