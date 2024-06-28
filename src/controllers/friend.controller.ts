import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FriendService } from 'src/services/friend.service';
import { UserService } from 'src/services/user.service';

@Controller('friends')
@UseGuards(AuthGuard)
export class FriendController {
    constructor(private friendService: FriendService, private userService: UserService){}
    @Post()
    async sendFriendRequest(@Body('userReciveRequestId', ParseIntPipe) userReceiveRequestId: number, @Request() req){
        await this.userService.FindOne(undefined, undefined, userReceiveRequestId)
        const userSendRequest = JSON.parse(req.user.profile);
        return await this.friendService.SentFriendRequest(userSendRequest.id, userReceiveRequestId);
    }

    @Patch(':userSendRequestId')
    async handleFriendRequest(@Param('userSendRequestId', ParseIntPipe) userSendRequestId: number, @Request() req, 
        @Body('isAccept', ParseBoolPipe) isAccept: boolean){
        await this.userService.FindOne(undefined, undefined, userSendRequestId);
        const userReceiveRequest = JSON.parse(req.user.profile);
        return await this.friendService.HandleFriendRequest(userReceiveRequest.id, userSendRequestId, isAccept);
    }
}
