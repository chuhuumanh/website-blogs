import { Module } from '@nestjs/common';
import { NotificationController } from 'src/controllers/notification.controller';
import { NotificationService } from 'src/services/notification.service';

@Module({
    providers: [NotificationService],
    controllers: [NotificationController]
})
export class NotificationModule {}
