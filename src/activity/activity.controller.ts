import { Body, Controller, Post, Query, Delete, ParseIntPipe, Param, Patch, Sse, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { Roles, Role } from 'src/role/role.decorator';
import { ActivityService } from './activity.service';
import { ActionService } from 'src/action/action.service';
import { NotificationService } from 'src/notification/notification.service';
import { PostService } from 'src/post/post.service';
import { ActivityCreateDto } from 'src/validation/activity.create.dto';
import { ActivityUpdateDto } from 'src/validation/activity.update.dto';

@Roles(Role.Admin, Role.User)
@Controller('activities')
export class ActivityController {
    constructor(private activityService: ActivityService, private actionService: ActionService, 
        private notificationService: NotificationService, private postService: PostService){}

    @Sse('notifications')
    fireEvent(){
        return this.notificationService.subscribe();
    }
    @UseGuards(AuthGuard)
    @Post()
    async actionPerform(@Body(new ValidationPipe()) activityDto: ActivityCreateDto, @Request() req: any){
        const user = JSON.parse(req.user.profile);
        activityDto.userId = user.id;
        const actionPerformed = await this.actionService.FindOneByName(activityDto.action);
        let notify = null;
        if(actionPerformed.name === "comment")
            notify = await this.activityService.PublishComment(activityDto);
        else notify =  await this.activityService.PerformAction(actionPerformed, activityDto);
        if(notify){
            const postOwnerId = (await this.postService.FindOneById(activityDto.postId)).user.id;
            const notificationId = await this.notificationService.Add(actionPerformed.id, activityDto.userId, postOwnerId, activityDto.postId);
            const notification = await this.notificationService.getNotificationById(notificationId.id)
            this.notificationService.emit({receiverId: postOwnerId, message: notification});
        }
        return notify.message;
        
    }
    @UseGuards(AuthGuard)
    @Patch('comments/:id/')
    async updateComment(@Param('id', ParseIntPipe)postId, @Body(new ValidationPipe())updatedComment : ActivityUpdateDto){
        return await this.activityService.UpdateComment(postId, updatedComment)
    }
    @UseGuards(AuthGuard)
    @Delete('comments/:id')
    async deleteComent(@Param('id', ParseIntPipe) postId: number ,@Query('userId', ParseIntPipe) userId: number){
        return await this.activityService.DeleteComment(postId, userId);
    }
}
