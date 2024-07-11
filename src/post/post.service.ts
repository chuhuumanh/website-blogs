import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionService } from 'src/action/action.service';
import { ActivityService } from 'src/activity/activity.service';
import { CategoryService } from 'src/category/category.service';
import { DatetimeService } from 'src/datetime/datetime.service';
import { ImageService } from 'src/image/image.service';
import { NotificationService } from 'src/notification/notification.service';
import { TagService } from 'src/tag/tag.service';
import { UserService } from 'src/user/user.service';
import { PostDto } from 'src/validation/post.dto';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Posts } from './posts.entity';
import { Users } from 'src/user/users.entity';
@Injectable()
export class PostService {
    constructor(@InjectRepository(Posts) private postRepository: Repository<Posts>, private dateTime: DatetimeService,
                private categoryService: CategoryService, private tagService: TagService, @Inject(forwardRef(() => UserService)) private userService: UserService,
                @Inject(forwardRef(() => ActivityService)) private activityService: ActivityService, private actionService: ActionService, 
                @Inject(forwardRef(() => ImageService)) private imgService: ImageService,
                private notificationService: NotificationService){}

    async add(post: PostDto): Promise<any>{
        const publishedDate = this.dateTime.getDateTimeString();
        const categories = await this.categoryService.findCategoriesById(post.categoriesId);
        
        if(post.tagsId)
            var tags = await this.tagService.findTagsById(post.tagsId);
        const newPost = await this.postRepository.save({title: post.title, content: post.content, 
                                        likedCount: 0, sharedCount: 0, savedCount: 0, 
                                        commentCount: 0, publishedDate:publishedDate,
                                        user:{id: post.userId}, access: {id: post.accessId}, 
                                        categories: categories, tags: tags});
        const options = {
            id: post.userId
        }
        const user = await this.userService.findOne(options);
        const updatedUser: Partial<Users> = {
            postPublishedCount: user.postPublishedCount + 1
        }
        await this.userService.updateUserInfor(user.id, updatedUser);
        return newPost;
    }

    async findOneById(id: number): Promise<Posts>{
        const post = await this.postRepository.findOne({where: {id}, relations:['user', 'access', 'tags', 'categories', 'images']});
        if(!post)
            throw new NotFoundException("Post not found !");
        return post;
    }

    async getUserPost(options: object): Promise<[Posts[], number] | any>{
        const post = await this.postRepository
        .findAndCount({
            where: {user: {id: options['id']}}, 
            relations: ['user', 'access'],
            skip: options['page'] - 1,
            take: options['take']
        })
        if(!post)
            throw new NotFoundException('Post not found !');
        return post;
    }

    async searchPosts(options?: object): Promise<[Posts[], number] | Posts | any>{

        const conditions: FindManyOptions<Posts> = {
            where: [
              { content: Like("%" + options['keyword'] + "%") },
              { title: Like("%" + options['keyword'] + "%") },
            ],
          };
        const posts = await this.postRepository
        .findAndCount({
            where: conditions.where, 
            skip: options['page'] - 1, 
            take: options['take'], 
            relations: ['user', 'access']
        });

        if(!posts)
            throw new NotFoundException('Post not found !');
        return {post: posts[0], count: posts[1]} ;
    }

    async getPostActivities(postId: number, actionName: string){
        const action = await this.actionService.findOneByName(actionName);
        await this.activityService.getPostActivities(postId, action);
    }

    async getPostImagesPath(postId: number){
        await this.findOneById(postId);
        return await this.imgService.getPostImagesPath(postId);
    }

    async updatePost(postId: number, updatePost: PostDto): Promise<object|any>{
        if(updatePost.categoriesId)
                var categories = await this.categoryService.findCategoriesById(updatePost.categoriesId);
            
        if(updatePost.tagsId)
                var tags = await this.tagService.findTagsById(updatePost.tagsId);
        
        await this.postRepository.save({id: postId, title: updatePost.title, content: updatePost.content,
            likedCount: updatePost.likeCount, sharedCount: updatePost.shareCount,
            savedCount: updatePost.saveCount, commentCount: updatePost.commentCount,
            categories: categories, tags: tags});
        return {message: "Update successfully !"};
    }

    async deleteUserPost(userId: number){
        await this.postRepository.delete({user: {id: userId}});
    }

    isOwner(userId: number, ownerId: number):Boolean{
        if(userId !== ownerId)
            throw new ForbiddenException('User is not Post Owner !');
        return true;
    }

    async deletePost(id: number, userId: number):Promise<object|any>{

        const post = await this.findOneById(id);
        this.isOwner(userId, post.user.id);
        await this.imgService.deletePostImages(id);
        await this.activityService.deletePostActivities(id);
        await this.notificationService.deletePostNotifications(id);
        await this.postRepository.delete({id});
        const options = {
            id: post.user.id
        }
        const user = await this.userService.findOne(options)
        const updatedUser: Partial<Users> = {
            postPublishedCount: user.postPublishedCount - 1
        }
        updatedUser['hash'] = false;
        await this.userService.updateUserInfor(user.id, updatedUser);
        return {message: "Deleted !"};
    }
}
