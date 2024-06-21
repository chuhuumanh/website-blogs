import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/validation/zodvalidation.pipe';
import { createLoginDto, createLoginSchema } from 'src/validation/account.schema';
import { createSignUpDto, createSignUpSchema } from 'src/validation/register.schema';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('login')
    @UsePipes(new ZodValidationPipe(createLoginSchema))
    login(@Body() signInDto: createLoginDto){
        return this.authService.SignIn(signInDto);
    }

    @Post('signup')
    @UsePipes(new ZodValidationPipe(createSignUpSchema))
    signup(@Body() signUpDto: createSignUpDto){
        return this.authService.SignUp(signUpDto)
    }
}