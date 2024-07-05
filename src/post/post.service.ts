import {Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts';
import { Repository, Like } from 'typeorm';
import { DatetimeService } from 'src/datetime/datetime.service';
import { CategoryService } from 'src/category/category.service';
import { TagService } from 'src/tag/tag.service';
import { UserService } from 'src/user/user.service';
import { PostDto } from 'src/validation/post.dto';
import { UserUpdateDto } from 'src/validation/user.update.dto';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class PostService {
    constructor(@InjectRepository(Posts) private postRepository: Repository<Posts>, private dateTime: DatetimeService,
                private categoryService: CategoryService, private tagService: TagService, private userService: UserService){}

    async add(post: PostDto): Promise<any>{
        const publishedDate = this.dateTime.getDateTimeString();
        const categories = [];
        for (const id of post.categoriesId) {
            const category = await this.categoryService.findCategoryById(id);
            categories.push(category);
        }
        const tags = []
        if(post.tagsId){
            for (const id of post.tagsId) {
                const tag = await this.tagService.findTagById(id);
                tags.push(tag);
            }
        }
        const newPost = await this.postRepository.save({title: post.title, content: post.content, 
                                        likedCount: 0, sharedCount: 0, savedCount: 0, 
                                        commentCount: 0, publishedDate:publishedDate,
                                        user:{id: post.userId}, access: {id: post.accessId}, 
                                        categories: categories, tags: tags});
        const options = {
            id: post.userId
        }
        const user = await this.userService.findOne(options);
        const updatedUser: UserUpdateDto = {
            publishedPostCount: user.postPublishedCount += 1,
            firstName: user.firstName, 
            lastName: user.lastName, 
            phoneNum: user.phoneNum, 
            password: user.password,
            email: user.email, 
            bio: user.bio,
            profilePicturePath: user.profilePicturePath,
            dateOfBirth: user.dateOfBirth,
            confirmPassword: user.password
        }
        await this.userService.updateUserInfor(user.id, updatedUser);
        return newPost
    }

    async findOneById(id: number): Promise<Posts>{
        const post = await this.postRepository.findOne({where: {id}, relations:['user', 'access']});
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

    async updatePost(id: number, updatePost: PostDto): Promise<object|any>{

        const categories = [];
        if(updatePost.categoriesId){
            for (const id of updatePost.categoriesId) {
                const category = await this.categoryService.findCategoryById(id);
                categories.push(category);
            }
        }
        const tags = []
        if(updatePost.tagsId){
            for (const id of updatePost.tagsId) {
                const tag = await this.tagService.findTagById(id);
                tags.push(tag);
            }
        }
        
        await this.postRepository.save({id, title: updatePost.title, content: updatePost.content,
            likedCount: updatePost.likeCount, sharedCount: updatePost.shareCount,
            savedCount: updatePost.saveCount, commentCount: updatePost.commentCount,
            categories: categories, tags: tags});
        return {message: "Update successfully !"};
    }

    async deleteUserPost(userId: number){
        await this.postRepository.delete({user: {id: userId}});
    }

    async deletePost(id: number):Promise<object|any>{
        const post = await this.findOneById(id);
        await this.postRepository.delete({id});
        const options = {
            id: post.user.id
        }
        const user = await this.userService.findOne(options)
        const updatedUser: UserUpdateDto = {
            publishedPostCount: user.postPublishedCount -= 1,
            firstName: user.firstName, 
            lastName: user.lastName, 
            phoneNum: user.phoneNum, 
            password: user.password,
            email: user.email, 
            bio: user.bio,
            profilePicturePath: user.profilePicturePath,
            dateOfBirth: user.dateOfBirth,
            confirmPassword: user.password
        }
        await this.userService.updateUserInfor(user.id, updatedUser);
        return {message: "Deleted !"};
    }
}
