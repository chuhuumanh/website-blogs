import { Controller, Sse, Post, Get, Request, UseGuards, Delete, Param, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Role, Roles } from 'src/role/role.decorator';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('notifications')
@Roles(Role.Admin, Role.User)
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService){}

  @Delete(':id')
  async deleteNotification(@Param('id', ParseIntPipe) id: number, @Request() req){
    const user = JSON.parse(req.user.profile);
    return await this.notificationService.delete(id, user.id);
  }
}
