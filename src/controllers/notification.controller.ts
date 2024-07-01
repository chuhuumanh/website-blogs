import { Controller, Sse, Get, Res, Request, Post } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NotificationService } from 'src/services/notification.service';

@Controller('notification')
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
