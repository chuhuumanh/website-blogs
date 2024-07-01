import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { FriendService } from './friend.service';
import { DatetimeService } from 'src/datetime/datetime.service';
import { Friends } from './friends';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { FriendController } from './friend.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Friends]), forwardRef(() => UserModule)],
    providers: [FriendService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [FriendController],
    exports: [FriendService]
})
export class FriendModule {}