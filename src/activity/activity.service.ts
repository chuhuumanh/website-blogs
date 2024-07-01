import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Activity } from "./activity";
import { Repository } from "typeorm";
import { Comments } from "./comments";
import { DatetimeService } from "src/datetime/datetime.service";
import { PostService } from "src/post/post.service";
import { Actions } from "src/action/actions";
import { PostDto } from "src/validation/post.dto";
import { ActivityCreateDto } from "src/validation/activity.create.dto";
import { ActivityUpdateDto } from "src/validation/activity.update.dto";

@Injectable()
export class ActivityService {
    constructor(@InjectRepository(Activity)private activityRepository: Repository<Activity>,
                @InjectRepository(Comments)private commentRepository: Repository<Comments>, 
                private dateTime: DatetimeService,
                private postService: PostService){}

    async performAction(action: Actions, activity: ActivityCreateDto): Promise<object|any>{
        const performedDate = this.dateTime.getDateTimeString();
        const isActionPerformed = await this.activityRepository
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
        if(!isActionPerformed){
            const notification = await this.activityRepository
                .insert({
                    user: {
                    id: activity.userId
                    },
                    post: {
                        id: activity.postId
                    },
                    action: {
                        id: action.id
                    },
                    activedDate: performedDate
                }
            );
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
                default:
                    throw new BadRequestException("Action invalid !");
            }
            const updatedPost: PostDto = {
                likeCount: performedPost.likedCount,
                saveCount: performedPost.savedCount,
                shareCount: performedPost.sharedCount
            };
            await this.postService.updatePost(activity.postId, updatedPost)
            return {notify:true, message: action.name + " post successful !"}
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
            await this.postService.updatePost(activity.postId, updatedPost)
            return {notify: false, message: "un" + action.name + " successful !"}
        }
    }
    async publishComment(comment: ActivityCreateDto):Promise<object| any>{
        const performedPost = await this.postService.findOneById(comment.postId);
        if(!performedPost)
            throw new NotFoundException('Post not found !');
        const performedDate = this.dateTime.getDateTimeString();
        const updatedPost: PostDto = {
            commentCount: performedPost.commentCount += 1
        };
        await this.postService.updatePost(comment.postId, updatedPost);
        await this.commentRepository
            .insert({
                content: comment.content, 
                postedDate: performedDate, 
                user: {
                    id: comment.userId
                }, 
                post: {
                    id: comment.postId
                }
            }
        );
        return {notify: true, message: "Comment successful !"};
    }

    async getPostComments(postId: number):Promise<[Comments[], number] | any>{
        await this.postService.findOneById(postId);
        return await this.commentRepository
            .findAndCount({
                where: {
                    post: {
                        id: postId
                    }
                }, 
                relations: ['user']
            }
        );
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
        const comment = await this.commentRepository
            .findOne({
                where: {id}, 
                relations: ['post', 'user']
            }
        );
        if(comment.user.id !== userId)
            throw new ForbiddenException("Cannot delete other's comment !");
        const post = await this.postService.findOneById(comment.post.id);
        const updatedPost: PostDto = {
            commentCount: post.commentCount -= 1
        };
        await this.commentRepository.delete(comment);
        await this.postService.updatePost(post.id, updatedPost);
        return {message: "Deleted !"};
    }

    async deletePostComments(postId: number){
        await this.commentRepository.delete({post :{id: postId}});
    }

    async deletePostActivities(postId: number){
        await this.activityRepository.delete({post: {id: postId}});
    }

    async deleteUserComments(userId: number){
        await this.commentRepository.delete({user: {id: userId}});
    }

    async deleteUserActivities(userId: number){
        await this.activityRepository.delete({user: {id: userId}});
    }

    async updateComment(id: number, updatedComment: ActivityUpdateDto):Promise<object | any>{
        const comment = await this.commentRepository
            .findOne({
                where: {id}, 
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
