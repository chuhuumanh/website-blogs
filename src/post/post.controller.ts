import { Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards, 
    UseInterceptors, ParseFilePipeBuilder, UploadedFiles, Request, ForbiddenException,
    BadRequestException} from '@nestjs/common';
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
import { NotificationService } from 'src/notification/notification.service';

@UseGuards(AuthGuard)
@Roles(Role.User, Role.Admin)
@Controller('posts')
export class PostController {
    constructor(private postService: PostService, private activityService: ActivityService, 
                private imgService: ImageService, private actionService: ActionService, private notificationService: NotificationService){}
    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    async addPost(@UploadedFiles(new ParseFilePipeBuilder().addMaxSizeValidator(null).build({fileIsRequired: false})) files: Array<Express.Multer.File>,
                  @Body(new ParseFormDataPipe, new ValidationPipe) postDto: PostDto, @Request() req){
        const user = JSON.parse(req.user.profile)
        postDto.userId = user.id;
        const newPost = await this.postService.add(postDto);
        console.log(files)
        if(files)
            await this.imgService.addPostImage(newPost.id, user.id, files)
        return {message: 'Post uploaded'};
    }

    @Get()
    searchPosts(@Query() options:{keyword: string, page: number, take: number} ){
        return this.postService.searchPosts(options);
    }

    @Get(':id')
    async getPostById(@Param('id', ParseIntPipe) postId: number){
        return await this.postService.findOneById(postId);
    }

    @Get(':id/activities')
    async getPostActivities(@Query('action') action: string, @Param('id', ParseIntPipe) postId: number){
        await this.postService.findOneById(postId);
        const actionPerformed = await this.actionService.findOneByName(action);
        if(actionPerformed.name === 'comment')
            return await this.activityService.getPostComments(postId);
        return await this.activityService.getPostActivities(postId, actionPerformed);
    }

    @Get(':id/images/path')
    async getPostImagesPath(@Param('id', ParseIntPipe) postId : number){
        await this.postService.findOneById(postId);
        return this.imgService.getPostImages(postId);
    }
    
    @Patch(':id')
    @UseInterceptors(FilesInterceptor('files'))
    async updatePost(@UploadedFiles(new ParseFilePipeBuilder().build({fileIsRequired: false})) files: Array<Express.Multer.File>, 
        @Body(new ParseFormDataPipe, new ValidationPipe()) postDto: PostDto, @Param('id', ParseIntPipe) postId: number, @Request() req){
        const user = JSON.parse(req.user.profile);
        const post = await this.postService.findOneById(postId);
        if(post.user.id !== user.id)
            throw new ForbiddenException("Cannot edit other's post");
        const message = await this.postService.updatePost(postId, postDto);
        if(files)
            await this.imgService.deletePostImages(postId);
            await this.imgService.addPostImage(postId, user.id, files);
        return message;
    }


    @Delete(':id')
    async deletePost(@Param('id', ParseIntPipe) postId: number, @Request() req){
        const user = JSON.parse(req.user.profile);
        const post = await this.postService.findOneById(postId);
        if(post.user.id !== user.id)
            throw new ForbiddenException("Cannot delete other's post !");
        await this.imgService.deletePostImages(postId);
        await this.activityService.deletePostComments(postId);
        await this.activityService.deletePostActivities(postId);
        await this.notificationService.deletePostNotifications(postId);
        return await this.postService.deletePost(postId);
    }
}
