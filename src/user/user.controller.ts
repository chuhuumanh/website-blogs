import { Controller, Get, Patch, Request, UseGuards, Body, UsePipes, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.decorator';
import { createFullNameDto, } from 'src/validation/fullname.schema';
import { ZodValidationPipe } from 'src/validation/zodvalidation.pipe';
import { UserService } from './user.service';
import { number } from 'zod';
import { ValidationPipe } from 'src/validation/validation.pipe';

@UseGuards(AuthGuard)
@Roles(Role.User)
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    @Get('profile')
    getUserProfile(@Request() req): any{
        return JSON.parse(req.user.profile);
    }

    @Patch(':id/name')
    updateUserFullName(@Body(new ValidationPipe()) newName: createFullNameDto, @Param('id', ParseIntPipe) userId: number): Promise<any>{
        return this.userService.UpdateName(userId, newName.firstName, newName.lastName)
    }

}
