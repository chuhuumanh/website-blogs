import { Controller, Get, Res, Req, UseGuards, Param, UseInterceptors, Post, Body, ParseIntPipe, UploadedFile, BadRequestException, UseFilters, Request} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserService } from 'src/user/user.service';
import { Role, Roles } from 'src/role/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import * as path from 'path'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles, ParseFilePipeBuilder } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { ParseFormDataPipe } from 'src/validation/parse.formdata.pipe';
import { ParseMessageBodyIntPipe } from 'src/validation/parse.message.body.int.pipe';
import { FileExceptionFilter } from 'src/exception/file.exception.filter';
@Controller('resource')
@UseGuards(AuthGuard)
@Roles(Role.Admin, Role.User)
export class ImageController {
    constructor(private imgService: ImageService, private userService: UserService, private postService: PostService){}
    
    @Get(':path(*)')
    async getImages(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('path') imgPath: string){
        const filePath = path.join(imgPath);
        const file = await this.imgService.getImageByPath(filePath);
        console.log(file['mimetype']);
        res.set({
            'Content-Type': `${file['mimetype']}`,
            'Content-Disposition': 'attachment;',
        });
        const stream = createReadStream(join(process.cwd(), filePath));
        return new StreamableFile(stream);
    }

    @UseFilters(new FileExceptionFilter())
    @UseInterceptors(FilesInterceptor('files'))
    @Post('public/images/posts')
    async uploadPostImages(@UploadedFiles(new ParseFilePipeBuilder().addMaxSizeValidator(null).build({fileIsRequired: false})) files: Array<Express.Multer.File>,
                           @Body(new ParseFormDataPipe, new ParseMessageBodyIntPipe('postId')) postId: number, @Request() req: any){
        const user = JSON.parse(req.user.profile);
        await this.postService.findOneById(postId);
        this.postService.isOwner(user.id, postId);
        await this.imgService.deletePostImages(postId);
        return await this.imgService.addPostImage(postId, files);
    }

    @UseFilters(new FileExceptionFilter())
    @Post('public/images/profiles')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfilePicture(@UploadedFile(new ParseFilePipeBuilder().build({fileIsRequired: false})) file: Express.Multer.File,
                               @Request() req: any){
        const user = JSON.parse(req.user.profile);
        await this.imgService.deleteUserProfilePicture(user.profilePicturePath);
        console.log(user)
        return await this.imgService.addUserProfilePicture(user.id, file);
    }
}
