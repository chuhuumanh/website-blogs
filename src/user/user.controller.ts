import { Controller, Get, Patch, Request, UseGuards, Body, Param, 
    ParseIntPipe, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { UserService } from './user.service';
import { PostService } from 'src/post/post.service';
import { ImageService } from 'src/image/image.service';
import { ActivityService } from 'src/activity/activity.service';
import { FriendService } from 'src/friend/friend.service';
import { NotificationService } from 'src/notification/notification.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFormDataPipe } from 'src/validation/parse.formdata.pipe';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { UserDto } from 'src/validation/user.dto';

@UseGuards(AuthGuard)
@Roles(Role.User, Role.Admin)
@Controller('users')
export class UserController {
    constructor(private userService: UserService, private postService: PostService, 
        private imgService: ImageService, private activityService: ActivityService, 
        private friendService: FriendService, private notificationService: NotificationService){}
    @Get('profile')
    getUserProfile(@Request() req): any{
        return JSON.parse(req.user.profile);
    }

    @Get(':id/profile')
    getOtherUserProfile(@Param('id', ParseIntPipe) userId: number){
        return this.userService.FindOne(undefined, undefined, userId);
    }

    @Get(':id/posts')
    async getOtherUserPosts(@Param('id', ParseIntPipe) userId :number){
        await this.userService.FindOne(undefined, undefined, userId);
        return await this.postService.GetUserPost(userId);
    }

    @Get('posts')
    async getUserPost(@Request() req){
        const user = JSON.parse(req.user.profile);
        return await this.postService.GetUserPost(user.id);
    }

    @Get(':id/friends')
    async getOtherUserFriends(@Param('id', ParseIntPipe) userId: number){
        await this.userService.FindOne(undefined, undefined, userId);
        const isAccept = true;
        return await this.friendService.GetUserFriends(userId, isAccept);
    }

    @Get('friends')
    async getUserFriends(@Request() req){
        const user = JSON.parse(req.user.profile);
        const isAccept = true;
        return await this.friendService.GetUserFriends(user.id, isAccept);
    }

    @Get('friends/requests')
    async getUserFriendRequests(@Request() req){
        const user = JSON.parse(req.user.profile);
        const isAccept = false;
        return await this.friendService.GetUserFriends(user.id, isAccept)
    }

    @Get('notifications')
    async getUserNotifications(@Request() req: any){
        const user = JSON.parse(req.user.profile);
        return await this.notificationService.GetUserNotifications(user.id);
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