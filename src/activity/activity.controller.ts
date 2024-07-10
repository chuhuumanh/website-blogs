import { Body, Controller, Delete, ParseIntPipe, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { Roles, Role } from 'src/role/role.decorator';
import { ActivityService } from './activity.service';
import { CommentUpdateDto } from 'src/validation/comment.update.dto';

@Roles(Role.Admin, Role.User)
@UseGuards(AuthGuard)
@Controller('activities')
export class ActivityController {
    constructor(private activityService: ActivityService){}
    
    @Patch('comments/:id/')
    async updateComment(@Param('id', ParseIntPipe)commentId, @Body(new ValidationPipe())updatedComment : CommentUpdateDto, @Request() req){
        const user = JSON.parse(req.user.profile);
        updatedComment.userId = user.id;
        return await this.activityService.updateComment(commentId, updatedComment)
    }
    
    @Delete('comments/:id')
    async deleteComent(@Param('id', ParseIntPipe) commentId: number, @Request() req){
        const user = JSON.parse(req.user.profile);
        return await this.activityService.deleteComment(commentId, user.id);
    }
}
