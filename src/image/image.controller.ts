import { Controller, Get, Res, Req, UseGuards, Param, UseInterceptors, Post, Body, ParseIntPipe, UploadedFile, BadRequestException} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { Role, Roles } from 'src/role/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import * as path from 'path'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles, ParseFilePipeBuilder } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { ParseFormDataPipe } from 'src/validation/parse.formdata.pipe';
import { ParseMessageBodyIntPipe } from 'src/validation/parse.message.body.int.pipe';
@Controller('resource')
@UseGuards(AuthGuard)
@Roles(Role.Admin, Role.User)
export class ImageController {
    constructor(private imgService: ImageService, private userService: UserService, private postService: PostService){}
    @Get(':path(*)')
    async getImages(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('path') imgPath: string){
        const filePath = path.join(imgPath);
        const file = await this.imgService.getPostImagesByPath(filePath);
        console.log(file)
        res.set({
            'Content-Type': `${file.mimetype}`,
            'Content-Disposition': 'attachment;',
        });
        const stream = createReadStream(join(process.cwd(), filePath));
        return new StreamableFile(stream);
    }

    @UseInterceptors(FilesInterceptor('files'))
    @Post('public/images/posts')
    async uploadPostImages(@UploadedFiles(new ParseFilePipeBuilder().addMaxSizeValidator(null).build({fileIsRequired: false})) files: Array<Express.Multer.File>,
                           @Body(new ParseFormDataPipe, new ParseMessageBodyIntPipe('postId')) postId: number){
        
        try{
            await this.postService.findOneById(postId);
            await this.imgService.addPostImage(postId, files)
        }
        catch(err){
            await this.imgService.deleteImages(files);
            throw err;
        }
    }

    @Post('public/images/profiles')
    @UseInterceptors(FilesInterceptor('file'))
    async uploadProfilePicture(@UploadedFiles(new ParseFilePipeBuilder().build({fileIsRequired: false})) files: Array<Express.Multer.File>,
                               @Body(new ParseFormDataPipe, new ParseMessageBodyIntPipe('userId')) userId: number){
        try{
            if(files.length > 1)
                throw new BadRequestException('Only upload one profile picture');
            const options = {
                id: userId
            }
            await this.userService.findOne(options);
        }
        catch(err){
            await this.imgService.deleteImages(files)
            throw err;
        }
    }
}
