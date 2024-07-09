import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from './images';
import { DatetimeService } from 'src/datetime/datetime.service';
import { PostService } from 'src/post/post.service';
import * as fs from 'fs/promises'
import * as path from 'path'
import { unlink } from 'fs';
import { Users } from 'src/user/users';
import { createReadStream } from 'fs';


@Injectable()
export class ImageService {
    constructor(@InjectRepository(Images) private ImagesRepository: Repository<Images>, private dateTimeService: DatetimeService,
                private postService: PostService, @InjectRepository(Users) private userRepository: Repository<Users>){}

    async addPostImage(postId: number, files: Array<Express.Multer.File>): Promise<any>{
        const uploadedDate = this.dateTimeService.getDateTimeString();
        let filePaths = []
        for(const file of files){
            const fileType = file.mimetype.split('/')[1];
            const newFilePath = `${file.path}.${fileType}`;
            await fs.rename(file.path, newFilePath)
            await this.ImagesRepository.insert({imgPath: newFilePath, uploadedDate: uploadedDate, fileType: fileType, 
                size: file.size, post: {id: postId}, mimetype: file.mimetype});
            filePaths.push(newFilePath);
        };
        return {allFilePath: filePaths};
    }

    async addUserProfilePicture(userId: number, file: Express.Multer.File){
        const fileType = file.mimetype.split('/')[1];
        const newFilePath = `${file.path}.${fileType}`;
        await fs.rename(file.path, newFilePath);
        await this.userRepository.update({id: userId}, {profilePicturePath: newFilePath});
        return {filePath: newFilePath};
    }


    async getImageByPath(imgPath: string){
        try{
            const img = await this.ImagesRepository.findOneBy({imgPath});
            if(!img)
                throw new NotFoundException('Image not found !');
            img['stream'] = createReadStream(path.join(process.cwd(), img.imgPath));
            return img;
        }
        catch{
            const img = await this.userRepository.findOneBy({profilePicturePath: imgPath});
            if(!img)
                return new NotFoundException('Image not found !');
            const fileType = img.profilePicturePath.split('.')[1];
            img['mimetype'] = path.join('image', fileType);
            img['stream'] = createReadStream(path.join(process.cwd(), img.profilePicturePath));
            return img;
        }
    }

    async getPostImagesPath(postId: number): Promise<[Images[], number]>{
        await this.postService.findOneById(postId);
        const files = await this.ImagesRepository.findAndCount({where: {post: {id: postId}}});
        return files;
    }

    async deletePostImages(postId: number){
        const images = await this.ImagesRepository.findBy({post: {id: postId}});
        for(const image of images ){
            try{
                await fs.unlink(`${image.imgPath}`);
            }
            catch{
                console.log(`${image.imgPath} not found !`);
            }
            await this.ImagesRepository.delete(image);
        }
        return {message: "Deleted !"};
    }

    async deleteUserProfilePicture(path: string){
        try{
            await fs.unlink(`${path}`);
        }
        catch{
            console.log('File not found !');
        }   
    }

    async deleteImages(files: Array<Express.Multer.File>){
        for(const file of files){
            await fs.unlink(`${file.path}`);
        }
        return {messages: 'Deleted files'};
    }
    
    async deleteImage(file: Express.Multer.File){
        await fs.unlink(`${file.path}`);
        return {message: 'Deleted file !'};
    }
}
