import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { UserSignInDto } from 'src/validation/user.signin.dto';
import { UserRegisterDto } from 'src/validation/user.register.dto';


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
}