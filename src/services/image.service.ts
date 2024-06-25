import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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

    async AddPostImage(images: ImageDto): Promise<any>{
        const uploadedDate = this.dateTimeService.GetDateTimeString();
        await this.ImagesRepository.save({imgPath: images.imgPath, uploadedDate: uploadedDate, fileType: images.fileType, 
                                            size: images.size, post: {id: images.postId}});
        return {message: "Successful !"};
    }

    async FindImages(userId: number): Promise<[Images[], number] | undefined>{
        return await this.ImagesRepository.findAndCount();
    }

    async GetPostImages(postId: number): Promise<[Images[], number]| any>{
        return await this.ImagesRepository.findAndCount({where: {post: {id: postId}}});
    }

    async DeleteImagesFromPost(id: number, postId: number){
        const action = await this.ImagesRepository.delete({id, post: {id: postId}});
        if(action.affected === 0)
            throw new NotFoundException("Images Not Found !");
        return {message: "Deleted !"};
    }
}
