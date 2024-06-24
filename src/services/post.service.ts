import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Posts } from 'src/entity/posts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PostDto } from 'src/validation/post.dto';
import { DatetimeService } from './datetime.service';
@Injectable()
export class PostService {
    constructor(@InjectRepository(Posts) private postRepository: Repository<Posts>, private dateTime: DatetimeService){}

    async Add(post: PostDto): Promise<any>{
        
        const publishedDate = this.dateTime.GetDateTimeString();
        console.log(publishedDate);
        await this.postRepository.insert({title: post.title, content: post.content, 
                                          likedCount: 0, sharedCount: 0, savedCount: 0, 
                                          commentCount: 0, images: post.images, publishedDate:publishedDate, 
                                          user:{id: post.userId}, access: {id: post.accessId}});
        return {message: "Successful !"};
    }

    async FindOne(id: number): Promise<Posts>{
        const post = await this.postRepository.findOne({where: {id}, relations:['user', 'access']});
        if(!post)
            throw new NotFoundException("Post not found !");
        return post;
    }

    async FindPost(keyword?: string): Promise<[Posts[], number] | undefined>{
        return await this.postRepository.findAndCount({where: {title: Like('%' + keyword + '%'), content: Like('%' + keyword + '%')}});
    }

    async UpdatePost(id: number, updatePost: PostDto): Promise<object|any>{
        const isCategoryExist = await this.postRepository.findOne({where:{id}});
        if(!isCategoryExist)
            throw new NotFoundException("This post is not exist!");
        const action =  await this.postRepository.update({id}, {title: updatePost.title, content: updatePost.content, images: updatePost.images,
                                                                likedCount: updatePost.likeCount, sharedCount: updatePost.shareCount,
                                                                savedCount: updatePost.saveCount, commentCount: updatePost.commentCount
        });
        if(action.affected === 0)
            return {message: "Update failed !"};
        return {message: "Update successfully !"};
    }

    async DeletePost(id: number):Promise<object|any>{
        const action = await this.postRepository.delete({id});
        if(action.affected === 0)
            throw new NotFoundException("Post Not Found !");
        return {message: "Deleted !"};
    }

}
