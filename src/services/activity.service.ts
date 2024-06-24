import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/entity/activity';
import { Repository } from 'typeorm';
import { DatetimeService } from './datetime.service';
import { ActivityDto } from 'src/validation/activity.dto';
import { PostService } from './post.service';
import { Actions } from 'src/entity/actions';
import { PostDto } from 'src/validation/post.dto';

@Injectable()
export class ActivityService {
    constructor(@InjectRepository(Activity)private activityRepository: Repository<Activity>, 
                private dateTime: DatetimeService,
                private postService: PostService){}
    async PerformAction(action: Actions, activity: ActivityDto): Promise<object|any>{
        const performedDate = this.dateTime.GetDateTimeString();
        const isActionPerformed = await this.activityRepository.findOne({where: {user: {id: activity.userId},
                                                                           post: {id: activity.postId},
                                                                           action: {id: action.id}
        }});

        if(!isActionPerformed){
            await this.activityRepository.insert({user: {id: activity.userId},
                                                  post: {id: activity.postId},
                                                  action: {id: action.id},
                                                  activedDate: performedDate
            });
            const performedPost = await this.postService.FindOne(activity.postId);
            switch(action.name){
                case "like":
                    performedPost.likedCount += 1;
                    break;
                case "share":
                    performedPost.sharedCount += 1;
                    break;
                case "save":
                    performedPost.savedCount += 1;
                    break;
                case "comment":
                    performedPost.commentCount += 1;
                    break;
                default:
                    throw new BadRequestException("Action invalid !");
            }
            const updatedPost: PostDto = {
                title: performedPost.title,
                content: performedPost.content,
                userId: performedPost.user.id,
                accessId: performedPost.id,
                images: performedPost.images,
                likeCount: performedPost.likedCount,
                saveCount: performedPost.savedCount,
                shareCount: performedPost.sharedCount,
                commentCount: performedPost.commentCount
            };
            await this.postService.UpdatePost(activity.postId, updatedPost)
            return {message: "OK"}
        }
        
    }
}
