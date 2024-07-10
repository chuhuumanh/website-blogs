import { IsAlpha, IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "@nestjs/class-validator";
import { Exclude } from "class-transformer";

export class UserProfileDto{

    @IsNumber()
    id: number

    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    @Exclude()
    password: string

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

    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: Date

    @IsOptional()
    @IsString()
    profilePicturePath: string

    @IsBoolean()
    gender: boolean

    @IsOptional()
    @IsNumber()
    postPublishedCount: number
}

