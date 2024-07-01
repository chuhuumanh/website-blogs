import { Controller, Sse, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Role, Roles } from 'src/role/role.decorator';
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
