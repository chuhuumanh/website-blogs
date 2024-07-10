import { Module, forwardRef } from '@nestjs/common';
import { Notifications } from './notifications.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { DatetimeService } from 'src/datetime/datetime.service';
import { NotificationController } from './notification.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
@Module({
    imports: [TypeOrmModule.forFeature([Notifications]), forwardRef(() => AuthModule)],
    providers: [NotificationService, DatetimeService, JwtService],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule {}