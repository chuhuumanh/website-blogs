import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from 'src/controllers/friend.controller';
import { Friends } from 'src/entity/friends';
import { Users } from 'src/entity/users';
import { DatetimeService } from 'src/services/datetime.service';
import { FriendService } from 'src/services/friend.service';
import { UserService } from 'src/services/user.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Friends, Users])],
    providers: [FriendService, DatetimeService, UserService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [FriendController]
})
export class FriendModule {}