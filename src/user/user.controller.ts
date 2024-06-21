import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
    @Get()
    @UseGuards(AuthGuard)
    getUserInfor(@Request() req): any{
        return JSON.parse(req.user.profile);
    }
}
