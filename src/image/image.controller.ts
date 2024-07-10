import { Body, Controller, Get, Param, ParseFilePipeBuilder, Post, Req, Request, Res, StreamableFile, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileExceptionFilter } from 'src/filter/file.exception.filter';
import { NotOwnerException } from 'src/filter/not.owner.exception.filter';
import { Role, Roles } from 'src/role/role.decorator';
import { ParseFormDataPipe } from 'src/validation/parse.formdata.pipe';
import { ParseMessageBodyIntPipe } from 'src/validation/parse.message.body.int.pipe';
import { ImageService } from './image.service';
@Controller('resource')
@UseGuards(AuthGuard)
@Roles(Role.Admin, Role.User)
export class ImageController {
    constructor(private imgService: ImageService){}
    
    @Get(':path(*)')
    async getImages(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('path') imgPath: string){
        const filePath = path.join(imgPath);
        const file = await this.imgService.getImageByPath(filePath);
        res.set({
            'Content-Type': `${file['mimetype']}`,
            'Content-Disposition': 'attachment;',
        });
        return new StreamableFile(file['stream']);
    }

    @UseFilters(new FileExceptionFilter(), new NotOwnerException())
    @UseInterceptors(FilesInterceptor('files'))
    @Post('public/images/posts')
    async uploadPostImages(@UploadedFiles(new ParseFilePipeBuilder().addMaxSizeValidator(null).build({fileIsRequired: false})) files: Array<Express.Multer.File>,
                           @Body(new ParseFormDataPipe, new ParseMessageBodyIntPipe('postId')) postId: number, @Request() req: any){
        const user = JSON.parse(req.user.profile);
        return await this.imgService.addPostImage(user.id, postId, files);
    }

    @UseFilters(new FileExceptionFilter(), new NotOwnerException())
    @Post('public/images/profiles')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfilePicture(@UploadedFile(new ParseFilePipeBuilder().build({fileIsRequired: false})) file: Express.Multer.File,
                               @Request() req: any){
        const user = JSON.parse(req.user.profile);
        return await this.imgService.addUserProfilePicture(user.id, file);
    }
}
