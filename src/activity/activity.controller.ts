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
@UseGuards(AuthGuard)
@Controller('activities')
export class ActivityController {
    constructor(private activityService: ActivityService, private actionService: ActionService, 
        private notificationService: NotificationService, private postService: PostService){}
    
    @Patch('comments/:id/')
    async updateComment(@Param('id', ParseIntPipe)postId, @Body(new ValidationPipe())updatedComment : ActivityUpdateDto){
        return await this.activityService.updateComment(postId, updatedComment)
    }
    
    @Delete('comments/:id')
    async deleteComent(@Param('id', ParseIntPipe) postId: number ,@Query('userId', ParseIntPipe) userId: number){
        return await this.activityService.deleteComment(postId, userId);
    }
}
