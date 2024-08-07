import { IsNotEmpty, IsString } from "@nestjs/class-validator"
export class UserSignInDto{
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string
}