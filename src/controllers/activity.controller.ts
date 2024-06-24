import { Controller, Post, Query } from '@nestjs/common';
import { ActivityService } from 'src/services/activity.service';

@Controller('activity')
export class ActivityController {
    constructor(private activityService: ActivityService){}

    @Post()
    actionPerform(@Query() action: string){
        
    }
}
