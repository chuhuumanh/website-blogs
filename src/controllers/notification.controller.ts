import { Controller, Sse, Get, Res, Request, Post } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NotificationService } from 'src/services/notification.service';
import { Role, Roles } from 'src/auth/role.decorator';

@Controller('notification')
@Roles(Role.Admin, Role.User)
export class NotificationController {
  constructor(private notificationService: NotificationService){}
  @Sse('events')
  events() {
      return this.notificationService.subscribe();
  }

  @Post('emit')
  async emit() {
      this.notificationService.emit({message: "Hello"});
      return {ok: true};
  }
}
