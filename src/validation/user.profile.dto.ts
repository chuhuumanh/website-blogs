import {IsAlpha, IsBoolean, IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from "@nestjs/class-validator";
import { Exclude } from "class-transformer";
import { IsDate } from "class-validator";

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

