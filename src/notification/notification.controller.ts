import { Controller, Delete, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { NotificationService } from './notification.service';
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
