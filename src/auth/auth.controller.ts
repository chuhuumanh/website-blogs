import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { UserDto } from 'src/validation/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('login')
    async login(@Body(new ValidationPipe(["signin"])) signInDto: UserDto){
        return await this.authService.SignIn(signInDto);
    }

    @Post('signup')
    signup(@Body(new ValidationPipe(["registration"])) signUpDto: UserDto){
        return this.authService.SignUp(signUpDto)
    }
}