import { Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards,  Request} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostDto } from 'src/validation/post.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { Role, Roles } from 'src/role/role.decorator';
import { PostService } from './post.service';


@UseGuards(AuthGuard)
@Roles(Role.User, Role.Admin)
@Controller('posts')
export class PostController {
    constructor(private postService: PostService){}
    @Post()
    async addPost(@Body(new ValidationPipe) postDto: PostDto, @Request() req){
        const user = JSON.parse(req.user.profile)
        postDto.userId = user.id;
        await this.postService.add(postDto);
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
        return await this.postService.getPostActivities(postId, action);
    }

    @Get(':id/images/path')
    async getPostImagesPath(@Param('id', ParseIntPipe) postId : number){
        return this.postService.getPostImagesPath(postId);
    }
    
    @Patch(':id')
    async updatePost(@Body(new ValidationPipe) postDto: PostDto, @Param('id', ParseIntPipe) postId: number, @Request() req){
        const user = JSON.parse(req.user.profile);
        const post = await this.postService.findOneById(postId);
        this.postService.isOwner(user.id, post.user.id);
        return await this.postService.updatePost(postId, postDto);
    }

    @Delete(':id')
    async deletePost(@Param('id', ParseIntPipe) postId: number, @Request() req){
        const user = JSON.parse(req.user.profile);
        return await this.postService.deletePost(postId, user.id);
    }
}
