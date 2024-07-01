import {IsAlpha, IsBoolean, IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from "@nestjs/class-validator";

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

    @IsString()
    bio: string

    @IsDateString()
    dateOfBirth: Date

    @IsOptional()
    @IsString()
    profilePicturePath: string

    @IsBoolean()
    gender: boolean

    @IsNotEmpty()
    @IsNumber()
    roleId: number

    @IsOptional()
    @IsNumber()
    publishedPostCount: number
}

