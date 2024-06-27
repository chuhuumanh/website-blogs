import { BadRequestException, Body, Controller, Post, Query, Delete, ParseIntPipe, Param, Patch, Get } from '@nestjs/common';
import { ActionService } from 'src/services/action.service';
import { ActivityService } from 'src/services/activity.service';
import { ActivityDto } from 'src/validation/activity.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';

@Controller('activities')
export class ActivityController {
    constructor(private activityService: ActivityService, private actionService: ActionService){}

    @Post()
    async actionPerform(@Body(new ValidationPipe(['insert'])) activityDto: ActivityDto){
        const actionPerformed = await this.actionService.FindOneByName(activityDto.action);
        if(actionPerformed.name === "comment")
            return await this.activityService.PublishComment(activityDto);
        return await this.activityService.PerformAction(actionPerformed, activityDto);
    }

    @Patch('comments/:id/')
    async updateComment(@Param('id', ParseIntPipe)postId, @Body(new ValidationPipe(['update']))updatedComment : ActivityDto){
        return await this.activityService.UpdateComment(postId, updatedComment)
    }

    @Delete('comments/:id')
    async deleteComent(@Param('id', ParseIntPipe) postId: number ,@Query('userId', ParseIntPipe) userId: number){
        return await this.activityService.DeleteComment(postId, userId);
    }
}
