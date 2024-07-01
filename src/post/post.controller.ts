import { Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards, 
    UseInterceptors, ParseFilePipeBuilder, UploadedFiles, Request, ForbiddenException} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ActivityService } from 'src/activity/activity.service';
import { ParseFormDataPipe } from 'src/validation/parse.formdata.pipe';
import { PostDto } from 'src/validation/post.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { Role, Roles } from 'src/role/role.decorator';
import { PostService } from './post.service';
import { ImageService } from 'src/image/image.service';
import { ActionService } from 'src/action/action.service';

@UseGuards(AuthGuard)
@Roles(Role.User, Role.Admin)
@Controller('posts')
export class PostController {
    constructor(private postService: PostService, private activityService: ActivityService, 
                private imgService: ImageService, private actionService: ActionService){}
    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    async addPost(@UploadedFiles(new ParseFilePipeBuilder().addMaxSizeValidator(null).build({fileIsRequired: false})) files: Array<Express.Multer.File>,
                  @Body(new ParseFormDataPipe, new ValidationPipe) postDto: PostDto, @Request() req){
        const user = JSON.parse(req.user.profile)
        postDto.userId = user.id;
        const newPost = await this.postService.Add(postDto);
        if(files)
            await this.imgService.AddPostImage(newPost.id, user.id, files)
        return {message: 'Post uploaded'};
    }

    @Get()
    searchPosts(@Query() keyword: string ){
        return this.postService.SearchPosts(keyword);
    }

    @Get(':id')
    async getPostById(@Param('id', ParseIntPipe) postId: number){
        return await this.postService.FindOneById(postId);
    }

    @Get(':id/activities')
    async getPostActivities(@Query('action') action: string, @Param('id', ParseIntPipe) postId: number){
        const actionPerformed = await this.actionService.FindOneByName(action);
        if(actionPerformed.name === 'comment')
            return await this.activityService.GetPostComments(postId);
        return await this.activityService.GetPostActivities(postId, actionPerformed);
    }

    @Get(':id/images/path')
    async getPostImagesPath(@Param('id', ParseIntPipe) postId : number){
        return this.imgService.GetPostImages(postId);
    }
    
    @Patch(':id')
    @UseInterceptors(FilesInterceptor('files'))
    async updatePost(@UploadedFiles(new ParseFilePipeBuilder().build({fileIsRequired: false})) files: Array<Express.Multer.File>, 
        @Body(new ParseFormDataPipe, new ValidationPipe()) postDto: PostDto, @Param('id', ParseIntPipe) postId: number, @Request() req){
        const user = JSON.parse(req.user.profile);
        const post = await this.postService.FindOneById(postId);
        if(post.user.id !== user.id)
            throw new ForbiddenException("Cannot edit other's post");
        const message = await this.postService.UpdatePost(postId, postDto);
        if(files)
            await this.imgService.DeletePostImages(postId);
            await this.imgService.AddPostImage(postId, user.id, files);
        return message;
    }


    @Delete(':id')
    async deletePost(@Param('id', ParseIntPipe) postId: number, @Request() req){
        const user = JSON.parse(req.user.profile);
        const post = await this.postService.FindOneById(postId);
        if(post.user.id !== user.id)
            throw new ForbiddenException("Cannot delete other's post !");
        await this.imgService.DeletePostImages(postId);
        await this.activityService.DeletePostComments(postId);
        await this.activityService.DeletePostActivities(postId);
        return await this.postService.DeletePost(postId);
    }
}
