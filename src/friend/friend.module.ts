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
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Friends]), forwardRef(() => UserModule), ActionModule, NotificationModule, forwardRef(() => AuthModule)],
    providers: [FriendService, DatetimeService, FriendGateway, JwtService, {provide: APP_GUARD, useClass: RoleGuard}],
    controllers: [FriendController],
    exports: [FriendService]
})
export class FriendModule {}