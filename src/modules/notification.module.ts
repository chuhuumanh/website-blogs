import { Module } from '@nestjs/common';
import { NotificationController } from 'src/controllers/notification.controller';
import { NotificationService } from 'src/services/notification.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/entity/notifications';
import { DatetimeService } from 'src/services/datetime.service';

@Module({
    imports: [TypeOrmModule.forFeature([Notifications])],
    providers: [NotificationService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule {}