import { Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/auth/role.decorator';
import { ActivityService } from 'src/services/activity.service';
import { PostService } from 'src/services/post.service';
import { PostDto } from 'src/validation/post.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
@UseGuards(AuthGuard)
@Roles(Role.User)
@Controller('post')
export class PostController {
    constructor(private postService: PostService, private activityService: ActivityService){}
    @Post()
    addPost(@Body(new ValidationPipe()) post: PostDto){
        return this.postService.Add(post);
    }

    @Get()
    getPost(@Query() keyword: string ){
        return this.postService.FindPost(keyword);
    }

    @Get(':id/comments')
    async getPostId(@Param('id', ParseIntPipe) postId: number){
        return await this.activityService.GetPostComment(postId);
    }

    @Patch(':id')
    updatePost(@Body(new ValidationPipe(undefined)) post: PostDto, @Param('id', ParseIntPipe) postId: number){
        return this.postService.UpdatePost(postId, post)
    }

    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) postId: number){
        return this.postService.DeletePost(postId);
    }
}
