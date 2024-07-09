import { Module, forwardRef } from '@nestjs/common';
import { Notifications } from './notifications.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { DatetimeService } from 'src/datetime/datetime.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { NotificationController } from './notification.controller';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports: [TypeOrmModule.forFeature([Notifications]), forwardRef(() => UserModule), RoleModule, AuthModule],
    providers: [NotificationService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule {}