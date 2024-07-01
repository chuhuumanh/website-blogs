import { Module } from '@nestjs/common';
import { NotificationController } from 'src/controllers/notification.controller';
import { NotificationService } from 'src/services/notification.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';

@Module({
    providers: [NotificationService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [NotificationController]
})
export class NotificationModule {}