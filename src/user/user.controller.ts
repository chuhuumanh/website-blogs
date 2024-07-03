import { Controller, Get, Patch, Request, UseGuards, Body, Param, 
    ParseIntPipe, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, 
    ForbiddenException} from '@nestjs/common';
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
import { UserUpdateDto } from 'src/validation/user.update.dto';

@Controller('users')
@UseGuards(AuthGuard)
@Roles(Role.User, Role.Admin)
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
        return this.userService.findOne(undefined, undefined, userId);
    }

    @Get(':id/posts')
    async getOtherUserPosts(@Param('id', ParseIntPipe) userId :number){
        await this.userService.findOne(undefined, undefined, userId);
        return await this.postService.getUserPost(userId);
    }

    @Get('posts')
    async getUserPost(@Request() req){
        const user = JSON.parse(req.user.profile);
        return await this.postService.getUserPost(user.id);
    }

    @Get(':id/friends')
    async getOtherUserFriends(@Param('id', ParseIntPipe) userId: number){
        await this.userService.findOne(undefined, undefined, userId);
        const isAccept = true;
        return await this.friendService.getUserFriends(userId, isAccept);
    }

    @Get('friends')
    async getUserFriends(@Request() req){
        const user = JSON.parse(req.user.profile);
        const isAccept = true;
        return await this.friendService.getUserFriends(user.id, isAccept);
    }

    @Get('friends/requests')
    async getUserFriendRequests(@Request() req){
        const user = JSON.parse(req.user.profile);
        const isAccept = false;
        return await this.friendService.getUserFriends(user.id, isAccept)
    }

    @Get('notifications')
    async getUserNotifications(@Request() req: any){
        const user = JSON.parse(req.user.profile);
        return await this.notificationService.getUserNotifications(user.id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('file'))
    async updateUserProfile(@UploadedFile(new ParseFilePipeBuilder().build({fileIsRequired: false})) file: Express.Multer.File, 
        @Body(new ParseFormDataPipe, new ValidationPipe()) updateInfor: UserUpdateDto, 
        @Param('id', ParseIntPipe) userId: number, @Request() req): Promise<any>{
        const currentUser = JSON.parse(req.user.profile);
        if(currentUser.id !== userId)
            throw new ForbiddenException('UserId not match !');
        const user = await this.userService.findOne(undefined, undefined, userId);
        if(file){
            if(user.profilePicturePath)
                await this.imgService.deleteProfileImage(user.profilePicturePath);
            updateInfor.profilePicturePath = file.path;
        }
        return this.userService.updateUserInfor(userId, updateInfor)
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) userId: number, @Request() req){
        const currentUser = JSON.parse(req.user.profile);
        if(currentUser.id !== userId)
            throw new ForbiddenException('UserId not match !');
        const user = await this.userService.findOne(undefined, undefined, userId);
        if(user.profilePicturePath)
            await this.imgService.deleteProfileImage(user.profilePicturePath);
        await this.activityService.deleteUserActivities(userId);
        await this.activityService.deleteUserComments(userId);
        await this.imgService.deleteUserImages(userId);
        await this.postService.deleteUserPost(userId);
        return await this.userService.deleteUser(userId);
    }
}