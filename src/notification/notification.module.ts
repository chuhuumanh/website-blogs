import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notifications } from './notifications.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Notifications])],
    providers: [NotificationService],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule {}