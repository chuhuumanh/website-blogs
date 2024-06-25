import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/entity/activity';
import { Repository } from 'typeorm';
import { DatetimeService } from './datetime.service';
import { ActivityDto } from 'src/validation/activity.dto';
import { PostService } from './post.service';
import { Actions } from 'src/entity/actions';
import { PostDto } from 'src/validation/post.dto';
import { Comments } from 'src/entity/comments';
import { CommentDto } from 'src/validation/comment.dto';

@Injectable()
export class ActivityService {
    constructor(@InjectRepository(Activity)private activityRepository: Repository<Activity>,
                @InjectRepository(Comments)private commentRepository: Repository<Comments>, 
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
                default:
                    throw new BadRequestException("Action invalid !");
            }
            const updatedPost: PostDto = {
                likeCount: performedPost.likedCount,
                saveCount: performedPost.savedCount,
                shareCount: performedPost.sharedCount
            };
            await this.postService.UpdatePost(activity.postId, updatedPost)
            return {message: action.name + "ed this post !"}
        }
        return{message: "Already " + action.name + " this post !"}
    }
    async Comment(action: Actions, comment: CommentDto):Promise<object| any>{
        const performedPost = await this.postService.FindOne(comment.postId);
        console.log(performedPost)
        const performedDate = this.dateTime.GetDateTimeString();
        const updatedPost: PostDto = {
            commentCount: performedPost.commentCount += 1
        };
        await this.activityRepository.insert({user: {id: comment.userId},
            post: {id: comment.postId},
            action: {id: action.id},
            activedDate: performedDate
        });
        await this.postService.UpdatePost(comment.postId, updatedPost);
        await this.commentRepository.insert({content: comment.comment, postedDate: performedDate, 
                                            user: {id: comment.userId}, post: {id: comment.postId}});
    }

    async GetPostComment(postId: number):Promise<[Comments[], number] | any>{
        return await this.commentRepository.findAndCount({where: {post: {id: postId}}, relations: ['user', 'post']});
    }

    async GetPostActivity(postId: number, action: Actions){
        return await this.activityRepository.findAndCount({where: {post: {id: postId}, action: action}, relations: ['user', 'post']});
    }

    async DeleteComment(id: number, userId: number):Promise<object | any>{
        const comment = await this.commentRepository.findOne({where: {id}, relations: ['post', 'user']});
        if(comment.user.id !== userId)
            throw new ForbiddenException("Cannot delete other's comment !");
        const post = await this.postService.FindOne(comment.post.id);
        const updatedPost: PostDto = {
            commentCount: post.commentCount -= 1
        };
        await this.commentRepository.delete(comment);
        await this.postService.UpdatePost(post.id, updatedPost);
        return {message: "Deleted !"};
    }

    async UpdateComment(id: number, userId: number):Promise<object | any>{
        const comment = await this.commentRepository.findOne({where: {id}, relations: ['post', 'user']});
        if(comment.user.id !== userId)
            throw new ForbiddenException("Cannot edit other's comment !");
    }
}