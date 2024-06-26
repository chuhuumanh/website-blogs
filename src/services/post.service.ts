import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Posts } from 'src/entity/posts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PostDto } from 'src/validation/post.dto';
import { DatetimeService } from './datetime.service';
import { CategoryService } from './category.service';
import { Category } from 'src/entity/category';
import { TagService } from './tag.service';
@Injectable()
export class PostService {
    constructor(@InjectRepository(Posts) private postRepository: Repository<Posts>, private dateTime: DatetimeService,
                private categoryService: CategoryService, private tagService: TagService){}

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
        return newPost;
    }

    async FindOne(id: number): Promise<Posts>{
        const post = await this.postRepository.findOne({where: {id}, relations:['user', 'access']});
        if(!post)
            throw new NotFoundException("Post not found !");
        return post;
    }

    async GetUserPost(id: number): Promise<[Posts[], number] | any>{
        return await this.postRepository.findAndCount({where: {user: {id}}});
    }

    async SearchPosts(keyword?: string, id?: number): Promise<[Posts[], number] | Posts | any>{
        return await this.postRepository.findAndCount({where: {title: Like('%' + keyword + '%'), content: Like('%' + keyword + '%')}, relations: ['user', 'access']});
    }

    async UpdatePost(id: number, updatePost: PostDto): Promise<object|any>{
        const isPostExist = await this.postRepository.findOne({where:{id}, relations: ['user']});
        if(!isPostExist)
            throw new NotFoundException("This post is not exist!");
        if(updatePost.userId && undefined && updatePost.userId !== isPostExist.user.id)
            throw new ForbiddenException("Cannot edit other's post")

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
        
        const action =  await this.postRepository.save({id, title: updatePost.title, content: updatePost.content,
            likedCount: updatePost.likeCount, sharedCount: updatePost.shareCount,
            savedCount: updatePost.saveCount, commentCount: updatePost.commentCount,
            categories: categories, tags: tags});
        return {message: "Update successfully !"};
    }

    async DeletePost(id: number):Promise<object|any>{
        const action = await this.postRepository.delete({id});
        if(action.affected === 0)
            throw new NotFoundException("Post Not Found !");
        return {message: "Deleted !"};
    }
}
