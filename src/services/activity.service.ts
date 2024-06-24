import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/entity/activity';
import { Repository } from 'typeorm';
import { DatetimeService } from './datetime.service';
import { ActivityDto } from 'src/validation/activity.dto';

@Injectable()
export class ActivityService {
    constructor(@InjectRepository(Activity)private activityRepository: Repository<Activity>, private dateTime: DatetimeService){}
    async PerformAction(activity: ActivityDto): Promise<object|any>{
        const performedDate = this.dateTime.GetDateTimeString();
        const isActionPerformed = await this.activityRepository.findOne({where: {user: {id: activity.userId},
                                                                           post: {id: activity.postId},
                                                                           action: {id: activity.actionId}
        }});
        if(!isActionPerformed){
            await this.activityRepository.insert({user: {id: activity.userId},
                                                  post: {id: activity.postId},
                                                  action: {id: activity.actionId}
            });
            return {message: isActionPerformed.action.name}
        }
        
    }
}
