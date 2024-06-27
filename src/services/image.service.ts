import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from 'src/entity/images';
import { DatetimeService } from './datetime.service';
import { PostService } from './post.service';
import * as fs from 'fs'

@Injectable()
export class ImageService {
    constructor(@InjectRepository(Images) private ImagesRepository: Repository<Images>, private dateTimeService: DatetimeService,
                private postService: PostService){}

    async AddPostImage(postId: number, files: Array<Express.Multer.File>): Promise<any>{
        const uploadedDate = this.dateTimeService.GetDateTimeString();
        for(const file of files){
            const newFilePath = `${file.path}.${file.mimetype.split('/')[1]}`
            fs.rename(file.path, newFilePath, (err)=>{
                if(err)
                    console.log(err);
            })
            await this.ImagesRepository.insert({imgPath: newFilePath, uploadedDate: uploadedDate, fileType: file.mimetype.split('/')[1], 
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

    async DeleteProfileImage(imgPath: string){
       fs.unlink(imgPath, (err) =>{
        if(err)
            console.log(err);
       })
    }

    async DeleteUserImages(userId: number){
        const images = await this.ImagesRepository.findBy({user : {id: userId}})
        for(const image of images ){
            fs.unlink(`${image.imgPath}`, (err) => {
                if (err) {
                 console.error(err);
                 return err;
                }
            });
            await this.ImagesRepository.delete(image);
        }
    }

    async DeletePostImages(postId: number){
        const images = await this.ImagesRepository.findBy({post: {id: postId}});
        for(const image of images ){
            fs.unlink(`${image.imgPath}`, (err) => {
                if (err) {
                 console.error(err);
                 return err;
                }
            });
            await this.ImagesRepository.delete(image);
        }
        return {message: "Deleted !"};
    }
}
