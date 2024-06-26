import { Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile, ParseFilePipeBuilder, NotAcceptableException, UseFilters, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/auth/role.decorator';
import { ActionService } from 'src/services/action.service';
import { ActivityService } from 'src/services/activity.service';
import { ImageService } from 'src/services/image.service';
import { PostService } from 'src/services/post.service';
import { ParseFormDataPipe } from 'src/validation/parse.formdata.pipe';
import { PostDto } from 'src/validation/post.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';

@UseGuards(AuthGuard)
@Roles(Role.User, Role.Admin)
@Controller('post')
export class PostController {
    constructor(private postService: PostService, private activityService: ActivityService, 
                private imgService: ImageService, private actionService: ActionService){}
    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    async addPost(@UploadedFiles(new ParseFilePipeBuilder().build({fileIsRequired: false})) files: Array<Express.Multer.File>,
                  @Body(new ParseFormDataPipe, new ValidationPipe) postDto: PostDto){
        const newPost = await this.postService.Add(postDto);
        if(files)
            files.forEach(async (file) =>{
                await this.imgService.AddPostImage(newPost.id, file);
            });
        return{message: "Post uploaded !"};
    }

    @Get()
    searchPosts(@Query() keyword: string ){
        return this.postService.SearchPosts(keyword);
    }

    @Get(':id')
    async getPostById(@Param('id', ParseIntPipe) postId: number){
        return await this.postService.FindOne(postId);
    }

    @Get(':id/activities')
    async getPostActivities(@Query('action') action: string, @Param('id', ParseIntPipe) postId: number){
        const actionPerformed = await this.actionService.FindOne(action);
        if(!actionPerformed)
            throw new BadRequestException('Action invalid !');
        if(actionPerformed.name === 'comment')
            return await this.activityService.GetPostComment(postId);
        return await this.activityService.GetPostActivity(postId, actionPerformed);
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('files'))
    async updatePost(@UploadedFiles(new ParseFilePipeBuilder().build({fileIsRequired: false})) files: Array<Express.Multer.File>, 
               @Body(new ParseFormDataPipe, new ValidationPipe()) post: PostDto, @Param('id', ParseIntPipe) postId: number){
        const message = await this.postService.UpdatePost(postId, post);
        if(files)
            await this.imgService.DeleteImagesPost(postId);
            files.forEach(async (file) =>{
                await this.imgService.AddPostImage(postId, file);
            });
            console.table(files);
        return message;
    }


    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) postId: number){
        return this.postService.DeletePost(postId);
    }
    
}
