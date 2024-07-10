import { IsAlpha, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "@nestjs/class-validator"
export class UserUpdateDto{
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    confirmPassword: string

    @IsString()
    @IsNotEmpty()
    @IsAlpha()
    firstName: string

    @IsString()
    @IsNotEmpty()
    @IsAlpha()
    lastName: string

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNum: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    bio: string

    @IsDateString()
    dateOfBirth: Date

    @IsOptional()
    @IsString()
    profilePicturePath: string

    publishedPostCount: number
}