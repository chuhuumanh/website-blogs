import { Controller, Get, Patch, Request, UseGuards, Body, Param, ParseIntPipe, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.decorator';
import { UserService } from 'src/services/user.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { UserDto } from 'src/validation/user.dto';
import { PostService } from 'src/services/post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFormDataPipe } from 'src/validation/parse.formdata.pipe';
import { ImageService } from 'src/services/image.service';
import { ActivityService } from 'src/services/activity.service';

@UseGuards(AuthGuard)
@Roles(Role.User, Role.Admin)
@Controller('users')
export class UserController {
    constructor(private userService: UserService, private postService: PostService, 
        private imgService: ImageService, private activityService: ActivityService){}
    @Get('profile')
    getUserProfile(@Request() req): any{
        return JSON.parse(req.user.profile);
    }

    @Get(':id/profile')
    getOtherUserProfile(@Param('id', ParseIntPipe) userId: number){
        return this.userService.FindOne(undefined, undefined, userId);
    }

    @Get(':id/posts')
    async getUserPosts(@Param('id', ParseIntPipe) userId :number){
        return await this.postService.GetUserPost(userId);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('file'))
    async updateUserProfile(@UploadedFile(new ParseFilePipeBuilder().build({fileIsRequired: false})) file: Express.Multer.File, 
        @Body(new ParseFormDataPipe, new ValidationPipe(['update'])) updateInfor: UserDto, 
        @Param('id', ParseIntPipe) userId: number): Promise<any>{
        const user = await this.userService.FindOne(undefined, undefined, userId);
        if(user.profilePicturePath)
            await this.imgService.DeleteProfileImage(user.profilePicturePath);
        updateInfor.profilePicturePath = file.path;
        return this.userService.UpdateUserInfor(userId, updateInfor)
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) userId: number){
        const user = await this.userService.FindOne(undefined, undefined, userId);
        if(user.profilePicturePath)
            await this.imgService.DeleteProfileImage(user.profilePicturePath);
        await this.activityService.DeleteUserActivities(userId);
        await this.activityService.DeleteUserComments(userId);
        await this.imgService.DeleteUserImages(userId);
        await this.postService.DeleteUserPost(userId);
        return await this.userService.deleteUser(userId);
    }
}