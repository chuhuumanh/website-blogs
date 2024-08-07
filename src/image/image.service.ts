import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DatetimeService } from 'src/datetime/datetime.service';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { Users } from 'src/user/users.entity';
import { Repository } from 'typeorm';
import { Images } from './images.entity';

@Injectable()
export class ImageService {
    constructor(@InjectRepository(Images) private ImagesRepository: Repository<Images>, private dateTimeService: DatetimeService,
                @Inject(forwardRef(() => PostService)) private postService: PostService, 
                @Inject(forwardRef(() => UserService)) private userService: UserService){}

    async addPostImage(userId: number, postId: number, files: Array<Express.Multer.File>): Promise<any>{
        const post = await this.postService.findOneById(postId);
        this.postService.isOwner(userId, post.user.id);
        await this.deletePostImages(postId);
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
        const options = {
            id: userId
        }
        if(!file)
            throw new BadRequestException('File required');
        const user = await this.userService.findOne(options);
        if(!user)
            throw new NotFoundException('User not found !');
        if(user.profilePicturePath)
            await this.deleteUserProfilePicture(user.profilePicturePath);
        const fileType = file.mimetype.split('/')[1];
        const newFilePath = `${file.path}.${fileType}`;
        await fs.rename(file.path, newFilePath);
        const userUpdateDto: Partial<Users> = {
            profilePicturePath: newFilePath
        }
        await this.userService.updateUserInfor(userId, userUpdateDto);
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
            const img = await this.userService.findOne({profilePicturePath: imgPath});
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
