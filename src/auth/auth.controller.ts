import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserRegisterDto } from 'src/validation/user.register.dto';
import { UserSignInDto } from 'src/validation/user.signin.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('login')
    async login(@Body(new ValidationPipe()) signInDto: UserSignInDto){
        return await this.authService.signIn(signInDto);
    }

    @Post('signup')
    signup(@Body(new ValidationPipe()) signUpDto: UserRegisterDto){
        return this.authService.signUp(signUpDto)
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Request() req){
        await this.authService.logout(req.headers.authorization);
    }
}