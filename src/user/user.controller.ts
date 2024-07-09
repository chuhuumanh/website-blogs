import { Controller, Get, Patch, Request, UseGuards, Body, Param, 
    ParseIntPipe, Delete,Query} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { UserService } from './user.service';
import { PostService } from 'src/post/post.service';
import { ImageService } from 'src/image/image.service';
import { ActivityService } from 'src/activity/activity.service';
import { FriendService } from 'src/friend/friend.service';
import { NotificationService } from 'src/notification/notification.service';
import { ParseFormDataPipe } from 'src/validation/parse.formdata.pipe';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { UserUpdateDto } from 'src/validation/user.update.dto';
import { AuthService } from 'src/auth/auth.service';
import { PaginateDto } from 'src/validation/paginate.dto';
import { ParsePaginatePipe } from 'src/validation/parse.paginate.pipe';


@Controller('users')
@UseGuards(AuthGuard)
@Roles(Role.User, Role.Admin)
export class UserController {
    constructor(private userService: UserService, private postService: PostService, 
        private imgService: ImageService, private activityService: ActivityService, 
        private friendService: FriendService, private notificationService: NotificationService, private authService: AuthService){}
    @Get('profile')
    getUserProfile(@Request() req): any{
        const payload = JSON.parse(req.user.profile);
        const options = {
            id: payload.id
        };
        return this.userService.findOne(options);
    }

    @Get(':id/profile')
    getOtherUserProfile(@Param('id', ParseIntPipe) userId: number){
        const options = {
            id: userId
        }
        return this.userService.findOne(options);
    }

    @Get(':id/posts')
    async getOtherUserPosts(@Param('id', ParseIntPipe) userId :number, @Query(new ParsePaginatePipe, new ValidationPipe) paginate: PaginateDto){
        const options = {
            id: userId
        }
        paginate['id'] = userId;
        await this.userService.findOne(options);
        return await this.postService.getUserPost(options);
    }

    @Get('posts')
    async getUserPost(@Request() req, @Query() @Query(new ParsePaginatePipe, new ValidationPipe) paginate: PaginateDto){
        const user = JSON.parse(req.user.profile);
        paginate['id'] = user.id;
        return await this.postService.getUserPost(paginate);
    }

    @Get(':id/friends')
    async getOtherUserFriends(@Param('id', ParseIntPipe) userId: number, @Query(new ParsePaginatePipe, new ValidationPipe) paginate: PaginateDto){
        const options = {
            id: userId
        }
        await this.userService.findOne(options);
        paginate['isAccept'] = true;
        paginate['userId'] = options.id;
        return await this.friendService.getUserFriends(paginate);
    }

    @Get('friends')
    async getUserFriends(@Request() req, @Query(new ParsePaginatePipe, new ValidationPipe) paginate: PaginateDto){
        const user = JSON.parse(req.user.profile);
        paginate['isAccept'] = true;
        paginate['userId'] = user.id;
        return await this.friendService.getUserFriends(paginate);
    }

    @Get('friends/requests')
    async getUserFriendRequests(@Request() req, @Query(new ParsePaginatePipe , new ValidationPipe) paginate: PaginateDto){
        const user = JSON.parse(req.user.profile);
        paginate['isAccept'] = true;
        paginate['userId'] = user.id
        return await this.friendService.getUserFriends(paginate)
    }

    @Get('notifications')
    async getUserNotifications(@Request() req: any, @Query(new ParsePaginatePipe, new ValidationPipe) paginate: PaginateDto){
        const user = JSON.parse(req.user.profile);
        paginate['userId'] = user.id;
        return await this.notificationService.getUserNotifications(paginate);
    }

    @Patch(':id')
    async updateUserProfile(@Body(new ParseFormDataPipe, new ValidationPipe()) updateInfor: UserUpdateDto, @Request() req): Promise<any>{
        const currentUser = JSON.parse(req.user.profile);
        const options = {
            id: currentUser.id
        }
        const user = await this.userService.findOne(options);
        return this.userService.updateUserInfor(user.id, updateInfor);
    }

    @Delete(':id')
    async deleteUser(@Request() req){
        const currentUser = JSON.parse(req.user.profile);
        const options = {
            id: currentUser.id
        }
        const user = await this.userService.findOne(options);
        if(user.profilePicturePath)
            await this.imgService.deleteUserProfilePicture(user.profilePicturePath);
        await this.activityService.deleteUserActivities(user.id);
        await this.friendService.deleteUserFriends(user.id)
        await this.postService.deleteUserPost(user.id);
        await this.notificationService.deleteUserNotifications(user.id);
        await this.authService.logout(req.headers.authorization);
        return await this.userService.deleteUser(user.id);
    }
}