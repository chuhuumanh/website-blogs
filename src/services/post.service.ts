import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Posts } from 'src/entity/posts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PostDto } from 'src/validation/post.dto';
import { DatetimeService } from './datetime.service';
import { CategoryService } from './category.service';
import { Category } from 'src/entity/category';
import { TagService } from './tag.service';
import { UserService } from './user.service';
import { UserDto } from 'src/validation/user.dto';
import { ImageService } from './image.service';
import { object } from 'zod';
@Injectable()
export class PostService {
    constructor(@InjectRepository(Posts) private postRepository: Repository<Posts>, private dateTime: DatetimeService,
                private categoryService: CategoryService, private tagService: TagService, private userService: UserService){}

    async Add(post: PostDto): Promise<any>{
        const publishedDate = this.dateTime.GetDateTimeString();
        const categories = [];
        for (const id of post.categoriesId) {
            const category = await this.categoryService.FindCategoryById(id);
            categories.push(category);
        }
        const tags = []
        if(post.tagsId){
            for (const id of post.tagsId) {
                const tag = await this.tagService.FindTagById(id);
                tags.push(tag);
            }
        }
        const newPost = await this.postRepository.save({title: post.title, content: post.content, 
                                        likedCount: 0, sharedCount: 0, savedCount: 0, 
                                        commentCount: 0, publishedDate:publishedDate,
                                        user:{id: post.userId}, access: {id: post.accessId}, 
                                        categories: categories, tags: tags});
        const user = await this.userService.FindOne(undefined, undefined , post.userId);
        const updatedUser: UserDto = {
            publishedPostCount: user.postPublishedCount += 1,
            firstName: user.firstName, 
            lastName: user.lastName, 
            phoneNum: user.phoneNum, 
            password: user.password,
            email: user.email, 
            bio: user.bio,
            profilePicturePath: user.profilePicturePath,
            dateOfBirth: user.dateOfBirth,
            username: user.username,
            confirmPassword: user.password,
            gender: user.gender,
            roleId: user.role.id
        }
        await this.userService.UpdateUserInfor(user.id, updatedUser);
        return newPost
    }

    async FindOneById(id: number): Promise<Posts>{
        const post = await this.postRepository.findOne({where: {id}, relations:['user', 'access']});
        if(!post)
            throw new NotFoundException("Post not found !");
        return post;
    }

    async GetUserPost(id: number): Promise<[Posts[], number] | any>{
        const post = await this.postRepository
            .findAndCount({
                where: {
                    user: {id}
                }
            }
        );
        if(!post)
            throw new NotFoundException('Post not found !');
        return post;
    }

    async SearchPosts(keyword?: string, id?: number): Promise<[Posts[], number] | Posts | any>{
        const post = await this.postRepository
            .findAndCount({
                where: {
                    title: Like('%' + keyword + '%'), 
                    content: Like('%' + keyword + '%')
                }, 
                relations: ['user', 'access']
            }
        );
        if(!post)
            throw new NotFoundException('Post not found !');
        return post;
    }

    async UpdatePost(id: number, updatePost: PostDto): Promise<object|any>{

        const categories = [];
        if(updatePost.categoriesId){
            for (const id of updatePost.categoriesId) {
                const category = await this.categoryService.FindCategoryById(id);
                categories.push(category);
            }
        }
        const tags = []
        if(updatePost.tagsId){
            for (const id of updatePost.tagsId) {
                const tag = await this.tagService.FindTagById(id);
                tags.push(tag);
            }
        }
        
        await this.postRepository.save({id, title: updatePost.title, content: updatePost.content,
            likedCount: updatePost.likeCount, sharedCount: updatePost.shareCount,
            savedCount: updatePost.saveCount, commentCount: updatePost.commentCount,
            categories: categories, tags: tags});
        return {message: "Update successfully !"};
    }

    async DeleteUserPost(userId: number){
        await this
        await this.postRepository.delete({user: {id: userId}});
    }

    async DeletePost(id: number):Promise<object|any>{
        const post = await this.FindOneById(id);
        await this.postRepository.delete({id});
        
        const user = await this.userService.FindOne(undefined, undefined, post.user.id)
        const updatedUser: UserDto = {
            publishedPostCount: user.postPublishedCount -= 1,
            firstName: user.firstName, 
            lastName: user.lastName, 
            phoneNum: user.phoneNum, 
            password: user.password,
            email: user.email, 
            bio: user.bio,
            profilePicturePath: user.profilePicturePath,
            dateOfBirth: user.dateOfBirth,
            username: user.username,
            confirmPassword: user.password,
            gender: user.gender,
            roleId: user.role.id
        }
        await this.userService.UpdateUserInfor(user.id, updatedUser);
        return {message: "Deleted !"};
    }
}
