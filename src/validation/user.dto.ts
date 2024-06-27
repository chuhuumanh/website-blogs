import { ValidateNested, IsAlpha, IsBoolean, IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsNumber, IsOptional, IsDate, IsDateString } from "@nestjs/class-validator";

export class UserDto{

    @IsString({groups: ['registration', 'signin']})
    @IsNotEmpty({groups: ['registration', 'signin']})
    username: string

    @IsString({groups: ['registration', 'signin']})
    @IsNotEmpty({groups: ['registration', 'signin']})
    password: string

    @IsString({groups: ['registration']})
    @IsNotEmpty({groups: ['registration']})
    confirmPassword: string

    @IsString({groups: ['registration', 'update']})
    @IsNotEmpty({groups: ['registration', 'update']})
    @IsAlpha()
    firstName: string

    @IsString({groups: ['registration', 'update']})
    @IsNotEmpty({groups: ['registration', 'update']})
    @IsAlpha()
    lastName: string

    @IsString({groups: ['registration', 'update']})
    @IsNotEmpty({groups: ['registration', 'update']})
    @IsPhoneNumber()
    phoneNum: string

    @IsString({groups: ['registration', 'update']})
    @IsNotEmpty({groups: ['registration', 'update']})
    @IsEmail()
    email: string

    @IsString({groups: ['update']})
    bio: string

    @IsDateString({groups: ['registration', 'update']})
    dateOfBirth: Date

    @IsOptional({groups: ['update']})
    @IsString({groups: ['update']})
    profilePicturePath: string

    @IsBoolean({groups: ['registration']})
    gender: boolean

    @IsNotEmpty({groups: ['registration']})
    @IsNumber()
    roleId: number
}

