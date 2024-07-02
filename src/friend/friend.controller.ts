import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { FriendService } from './friend.service';
import { UserService } from 'src/user/user.service';

@Controller('friends')
@UseGuards(AuthGuard)
@Roles(Role.Admin, Role.User)
export class FriendController {
    constructor(private friendService: FriendService, private userService: UserService){}
    @Post()
    async sendFriendRequest(@Body('userReciveRequestId', ParseIntPipe) userReceiveRequestId: number, @Request() req){
        await this.userService.findOne(undefined, undefined, userReceiveRequestId)
        const userSendRequest = JSON.parse(req.user.profile);
        return await this.friendService.sentFriendRequest(userSendRequest.id, userReceiveRequestId);
    }

    @Patch(':userSendRequestId')
    async handleFriendRequest(@Param('userSendRequestId', ParseIntPipe) userSendRequestId: number, @Request() req, 
        @Body('isAccept', ParseBoolPipe) isAccept: boolean){
        await this.userService.findOne(undefined, undefined, userSendRequestId);
        const userReceiveRequest = JSON.parse(req.user.profile);
        if(isAccept)
            return await this.friendService.acceptFriendRequest(userReceiveRequest.id, userSendRequestId);
        return await this.friendService.deleteFriend(userSendRequestId, userReceiveRequest.id)
    }

    @Delete(':id')
    async deleteFriend(@Param('id', ParseIntPipe) friendId: number, @Request() req){
        await this.userService.findOne(undefined, undefined, friendId);
        const currentUser = JSON.parse(req.user.profile);
        return await this.friendService.deleteFriend(friendId, currentUser.id);
    }
}
