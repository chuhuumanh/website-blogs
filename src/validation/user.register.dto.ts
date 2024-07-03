import {IsAlpha, IsBoolean, IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from "@nestjs/class-validator";
import { IsDate } from "class-validator";

export class UserRegisterDto{

    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string

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
    publishedPostCount: number
}

