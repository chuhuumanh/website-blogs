import { Module, forwardRef } from '@nestjs/common';
import { Notifications } from './notifications';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { DatetimeService } from 'src/datetime/datetime.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { NotificationController } from './notification.controller';
import { UserModule } from 'src/user/user.module';
@Module({
    imports: [TypeOrmModule.forFeature([Notifications]), forwardRef(() => UserModule) ],
    providers: [NotificationService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule {}