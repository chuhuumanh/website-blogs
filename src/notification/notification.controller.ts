import { Controller, Sse, Post, Get, Request, UseGuards, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Role, Roles } from 'src/role/role.decorator';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('notifications')
@Roles(Role.Admin, Role.User)
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService, private userService: UserService){}

  @Get()
  async getUserNotifications(@Request() req){
    const user = JSON.parse(req.user.profile).id;
    await this.userService.findOne(undefined, undefined, user);
    return await this.notificationService.getUserNotifications(user);
  }

  @Delete(':id')
  async deleteNotification(@Param('id', ParseIntPipe) id: number){
    await this.notificationService.getNotificationById(id);
    return await this.notificationService.delete(id);
  }
}
