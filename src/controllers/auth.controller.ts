import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { UserDto } from 'src/validation/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('login')
    login(@Body(new ValidationPipe(["signin"])) signInDto: UserDto){
        return this.authService.SignIn(signInDto);
    }

    @Post('signup')
    signup(@Body(new ValidationPipe(["registration", undefined])) signUpDto: UserDto){
        return this.authService.SignUp(signUpDto)
    }
}