import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Socket } from "dgram";
import { Server } from "http";
import { ActionService } from "src/action/action.service";
import { Actions } from "src/action/actions.entity";
import { WsConnectionAuth } from "src/auth/ws.connection.auth.guard";
import { DatetimeService } from "src/datetime/datetime.service";
import { NotificationService } from "src/notification/notification.service";
import { PostService } from "src/post/post.service";
import { ActivityCreateDto } from "src/validation/activity.create.dto";
import { CommentUpdateDto } from "src/validation/comment.update.dto";
import { PostDto } from "src/validation/post.dto";
import { Repository } from "typeorm";
import { Activity } from "./activity.entity";
import { Posts } from "src/post/posts.entity";
@Injectable()
export class ActivityService {
    constructor(@InjectRepository(Activity)private activityRepository: Repository<Activity>,
                private actionService: ActionService,
                private notificationService: NotificationService, 
                private dateTime: DatetimeService,
                private wsConnectionAuth: WsConnectionAuth,
                @Inject(forwardRef(() => PostService))private postService: PostService){}

    async performAction(activity: ActivityCreateDto): Promise<object|null>{
        const action = await this.actionService.findOneByName(activity.action);
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
            const updatedPost: Partial<Posts> = {
                likedCount: performedPost.likedCount,
                savedCount: performedPost.savedCount,
                sharedCount: performedPost.sharedCount,
                commentCount: performedPost.commentCount
            };
            await this.postService.updatePost(activity.postId, updatedPost);
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
            
            const updatedPost: Partial<Posts> = {
                likedCount: performedPost.likedCount,
                savedCount: performedPost.savedCount,
                sharedCount: performedPost.sharedCount,
            };
            await this.postService.updatePost(activity.postId, updatedPost);
            return {message: 'Undo action successful !', notification: {receiverId: -1}};
        }
    }

    async findCommentById(id: number){
        const isCommentExist =  await this.activityRepository.findOneBy({id, action: {name: 'comment'}});
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

    async handleConnection(client: Socket, server: Server){
        const canActivate = await this.wsConnectionAuth.canActivate(client);
        if(!canActivate){
          server.emit('connection', 'Unauthorize !')
          client.disconnect();
        }     
    }

    async deleteComment(id: number, userId: number):Promise<object | any>{
        await this.findCommentById(id);
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
        await this.activityRepository.delete(comment);
        await this.postService.updatePost(post.id, updatedPost);
        return {message: "Deleted !"};
    }

    async deletePostActivities(postId: number){
        await this.activityRepository.delete({post: {id: postId}});
    }

    async deleteUserActivities(userId: number){
        await this.activityRepository.delete({user: {id: userId}});
    }

    async updateComment(id: number, updatedComment: CommentUpdateDto):Promise<object | any>{
        await this.findCommentById(id);
        const comment = await this.activityRepository
            .findOne({
                where: {id, action: {name: 'comment'}}, 
                relations: ['post', 'user']
            }
        );
        if(comment.user.id !== updatedComment.userId)
            throw new ForbiddenException("Cannot edit other's comment !");
        await this.activityRepository
            .update({id}, {comment: updatedComment.content});
        return{message: "Update comment Sucessful !"};
    }
}
