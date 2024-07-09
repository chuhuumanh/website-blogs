import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Activity } from "./activity.entity";
import { Repository } from "typeorm";
import { Comments } from "./comments.entity";
import { DatetimeService } from "src/datetime/datetime.service";
import { PostService } from "src/post/post.service";
import { PostDto } from "src/validation/post.dto";
import { ActivityCreateDto } from "src/validation/activity.create.dto";
import { Actions } from "src/action/actions.entity";
import { CommentUpdateDto } from "src/validation/comment.update.dto";
import { NotificationService } from "src/notification/notification.service";
import { Posts } from "src/post/posts.entity";
@Injectable()
export class ActivityService {
    constructor(@InjectRepository(Activity)private activityRepository: Repository<Activity>,
                @InjectRepository(Comments)private commentRepository: Repository<Comments>,
                @InjectRepository(Posts) private postRepository: Repository<Posts>,
                private notificationService: NotificationService, 
                private dateTime: DatetimeService,
                private postService: PostService){}

    async performAction(action: Actions, activity: ActivityCreateDto): Promise<object|null>{
        const performedDate = this.dateTime.getDateTimeString();
        let isActionPerformed = undefined;
        if(action.name !== 'comment')
            activity.content = null;
        if(action.name !== 'comment'){
            isActionPerformed = await this.activityRepository
                .findOne({
                    where: {
                        user: {
                            id: activity.userId
                        },
                        post: {
                            id: activity.postId
                        },
                        action: {
                            id: action.id
                        }
                    }
                }
            );
        }
        if(!isActionPerformed){
            await this.activityRepository
                .insert({
                    action: action, 
                    user: {id: activity.userId}, 
                    post: {id: activity.postId}, 
                    activedDate: performedDate,
                    comment: activity.content
                });
            const performedPost = await this.postService.findOneById(activity.postId);
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
                likeCount: performedPost.likedCount,
                saveCount: performedPost.savedCount,
                shareCount: performedPost.sharedCount,
                commentCount: performedPost.commentCount
            };
            await this.postRepository.update(activity.postId, updatedPost);
            const postOwnerId = (await this.postService.findOneById(activity.postId)).user.id;
            let notification = {receiverId: -1};
            const isNotificationExist = await this.notificationService.getByPostIdAndUserId(activity.userId, activity.postId, action.id)
            if((!isNotificationExist && action.name !== 'comment') || action.name === 'comment')
                notification = await this.notificationService.add(action.id, activity.userId, postOwnerId, activity.postId);
            return {message: action.name + " post successful !", notification: notification}
        }
        else{
            await this.activityRepository
                .delete({
                    user: {
                        id: activity.userId
                    }, 
                    post: {
                        id: activity.postId
                    }, 
                    action: {
                        id: action.id
                    }
                }
            );
            const performedPost = await this.postService.findOneById(activity.postId);
            switch(action.name){
                case "like":
                    performedPost.likedCount -= 1;
                    break;
                case "share":
                    performedPost.sharedCount -= 1;
                    break;
                case "save":
                    performedPost.savedCount -= 1;
                    break;
                default:
                    throw new BadRequestException("Action invalid !");
            }
            
            const updatedPost: PostDto = {
                likeCount: performedPost.likedCount,
                saveCount: performedPost.savedCount,
                shareCount: performedPost.sharedCount,
            };
            await this.postRepository.update(activity.postId, updatedPost);
            return {message: 'Undo action successful !', notification: {receiverId: -1}};
        }
    }

    async findCommentById(id: number){
        const isCommentExist =  await this.commentRepository.findOneBy({id});
        if(!isCommentExist)
            throw new NotFoundException("Comment not found !");
        return isCommentExist;
    }

    async getPostActivities(postId: number, action: Actions){
        await this.activityRepository
            .findAndCount({
                where: {
                    post: {
                        id: postId
                    }, 
                    action: action
                }, 
                relations: ['user']
            }
        );
    }

    async deleteComment(id: number, userId: number):Promise<object | any>{
        const comment = await this.activityRepository
            .findOne({
                where: {id, action: {name: 'comment'}}, 
                relations: ['post', 'user']
            }
        );
        if(comment.user.id !== userId)
            throw new ForbiddenException("Cannot delete other's comment !");
        const post = await this.postService.findOneById(comment.post.id);
        const updatedPost: PostDto = {
            commentCount: post.commentCount -= 1
        };
        
        await this.postRepository.update(post.id, updatedPost);
        return {message: "Deleted !"};
    }

    async deletePostActivities(postId: number){
        await this.activityRepository.delete({post: {id: postId}});
    }

    async deleteUserActivities(userId: number){
        await this.activityRepository.delete({user: {id: userId}});
    }

    async updateComment(id: number, updatedComment: CommentUpdateDto):Promise<object | any>{
        const comment = await this.activityRepository
            .findOne({
                where: {id, action: {name: 'comment'}}, 
                relations: ['post', 'user']
            }
        );
        if(comment.user.id !== updatedComment.userId)
            throw new ForbiddenException("Cannot edit other's comment !");
        await this.commentRepository
            .update({id}, {content: updatedComment.content});
        return{message: "Update comment Sucessful !"};
    }
}
