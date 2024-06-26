import { Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile, ParseFilePipeBuilder, NotAcceptableException, UseFilters, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/auth/role.decorator';
import { ActivityService } from 'src/services/activity.service';
import { ImageService } from 'src/services/image.service';
import { PostService } from 'src/services/post.service';
import { ParseFormDataPipe } from 'src/validation/parse.formdata.pipe';
import { PostDto } from 'src/validation/post.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';

@UseGuards(AuthGuard)
@Roles(Role.User)
@Controller('post')
export class PostController {
    constructor(private postService: PostService, private activityService: ActivityService, private imgService: ImageService){}
    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    async addPost(@UploadedFiles(new ParseFilePipeBuilder()
            .addFileTypeValidator({fileType: '^(.*\.(jpg|jpeg|png))$'})
            .build({fileIsRequired: false})
            ) 
            files: Array<Express.Multer.File>,
            @Body(new ParseFormDataPipe, new ValidationPipe) postDto: PostDto){
        const newPost = await this.postService.Add(postDto);
        if(files)
            files.forEach(async (file) =>{
                await this.imgService.AddPostImage(newPost.id, file);
            });
        return{message: "Post uploaded !"};
    }

    @Get()
    getPost(@Query() keyword: string ){
        return this.postService.FindPost(keyword);
    }

    @Get(':id/comments')
    async getPostId(@Param('id', ParseIntPipe) postId: number){
        return await this.activityService.GetPostComment(postId);
    }

    @Patch(':id/')
    updatePost(@Body(new ValidationPipe()) post: PostDto, @Param('id', ParseIntPipe) postId: number){
        return this.postService.UpdatePost(postId, post)
    }

    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) postId: number){
        return this.postService.DeletePost(postId);
    }
    
}
