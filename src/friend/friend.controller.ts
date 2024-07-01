import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
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
        return await this.friendService.handleFriendRequest(userReceiveRequest.id, userSendRequestId, isAccept);
    }
}
