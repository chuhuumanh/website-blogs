import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from 'src/entity/images';
import { DatetimeService } from './datetime.service';
import { PostService } from './post.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class ImageService {
    constructor(@InjectRepository(Images) private ImagesRepository: Repository<Images>, private dateTimeService: DatetimeService,
                private postService: PostService){}

    async AddPostImage(postId: number, files: Array<Express.Multer.File>): Promise<any>{
        const uploadedDate = this.dateTimeService.GetDateTimeString();
        for(const file of files){
            console.log(file.buffer);
            await this.ImagesRepository.insert({imgPath: file.path, uploadedDate: uploadedDate, fileType: file.mimetype.split('/')[1], 
                size: file.size, post: {id: postId}});
        };
        return {message: "Successful !"};
    }

    async GetPostImagesByPath(imgPath: string): Promise<Images| any>{
        const img = await this.ImagesRepository.findOneBy({imgPath});
        if(!img)
            throw new NotFoundException('Image not found !');
        return img;
    }

    async GetPostImages(postId: number): Promise<[Images[], number]>{
        await this.postService.FindOneById(postId);
        const files = await this.ImagesRepository.findAndCount({where: {post: {id: postId}}});
        return files;
    }

    async UpdatePostImages(postId: number){
        await this.ImagesRepository.delete({post: {id: postId}});
    }

    async DeletePostImages(postId: number){
        await this.ImagesRepository.delete({post: {id: postId}});
        return {message: "Deleted !"};
    }
}
