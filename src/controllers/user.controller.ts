import { Controller, Get, Patch, Request, UseGuards, Body, UsePipes, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.decorator';
import { UserService } from 'src/services/user.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { UserDto } from 'src/validation/user.dto';

@UseGuards(AuthGuard)
@Roles(Role.User, Role.Admin)
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    @Get('profile')
    getUserProfile(@Request() req): any{
        return JSON.parse(req.user.profile);
    }

    @Patch(':id')
    updateUserFullName(@Body(new ValidationPipe('update')) updateInfor: UserDto, @Param('id', ParseIntPipe) userId: number): Promise<any>{
        return this.userService.UpdateUserInfor(userId, updateInfor)
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) userId: number){
        return this.userService.deleteUser(userId)
    }

}
