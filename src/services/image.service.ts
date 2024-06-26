import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from 'src/entity/images';
import { ImageDto } from 'src/validation/image.dto';
import { DatetimeService } from './datetime.service';
import { PostService } from './post.service';

@Injectable()
export class ImageService {
    constructor(@InjectRepository(Images) private ImagesRepository: Repository<Images>, private dateTimeService: DatetimeService,
                private postService: PostService){}

    async AddPostImage(postId: number, file: Express.Multer.File): Promise<any>{
        const uploadedDate = this.dateTimeService.GetDateTimeString();
        await this.ImagesRepository.save({imgPath: file.path, uploadedDate: uploadedDate, fileType: file.mimetype.split('/')[1], 
                                            size: file.size, post: {id: postId}});
        return {message: "Successful !"};
    }

    async FindImages(userId: number): Promise<[Images[], number] | undefined>{
        return await this.ImagesRepository.findAndCount();
    }

    async GetPostImages(postId: number): Promise<[Images[], number]| any>{
        return await this.ImagesRepository.findAndCount({where: {post: {id: postId}}});
    }

    async UpdatePostImages(postId: number){
        await this.ImagesRepository.delete({post: {id: postId}});
    }

    async DeleteImagesPost(postId: number){
        await this.ImagesRepository.delete({post: {id: postId}});
        return {message: "Deleted !"};
    }
}
