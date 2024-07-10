import { Controller, Delete, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { FriendService } from './friend.service';

@Controller('friends')
@UseGuards(AuthGuard)
@Roles(Role.Admin, Role.User)
export class FriendController {
    constructor(private friendService: FriendService){}
    @Delete(':id')
    async deleteFriend(@Param('id', ParseIntPipe) friendId: number, @Request() req){
        const currentUser = JSON.parse(req.user.profile);
        return await this.friendService.deleteFriend(friendId, currentUser.id);
    }
}
