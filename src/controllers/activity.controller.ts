import { BadRequestException, Body, Controller, Post, Query } from '@nestjs/common';
import { ActionService } from 'src/services/action.service';
import { ActivityService } from 'src/services/activity.service';
import { ActivityDto } from 'src/validation/activity.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';

@Controller('activity')
export class ActivityController {
    constructor(private activityService: ActivityService, private actionService: ActionService){}

    @Post()
    async actionPerform(@Query('action') action: string, @Body(new ValidationPipe()) activityDto: ActivityDto){
        const actionPerformed = await this.actionService.FindOne(action);
        if(!actionPerformed)
            throw new BadRequestException('Action invalid');
        return await this.activityService.PerformAction(actionPerformed, activityDto);
    }
}
