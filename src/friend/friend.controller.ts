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
    @Delete(':id')
    async deleteFriend(@Param('id', ParseIntPipe) friendId: number, @Request() req){
        const options = {
            id: friendId
        }
        await this.userService.findOne(options);
        const currentUser = JSON.parse(req.user.profile);
        return await this.friendService.deleteFriend(friendId, currentUser.id);
    }
}
