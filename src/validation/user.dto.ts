import { ValidateNested, IsAlpha, IsBoolean, IsEmail, IsPhoneNumber, IsString } from "@nestjs/class-validator";

class Role {
    id: number
    name: string
}

export class UserDto{


    @IsString({groups: ['registration', 'signin']})
    username: string

    @IsString({groups: ['registration', 'signin']})
    password: string

    @IsString({groups: ['registration']})
    confirmPassword: string

    @IsString({groups: ['registration', 'update']})
    @IsAlpha()
    firstName: string

    @IsString({groups: ['registration', 'update']})
    @IsAlpha()
    lastName: string

    @IsString({groups: ['registration', 'update']})
    @IsPhoneNumber()
    phoneNum: string

    @IsString({groups: ['registration', 'update']})
    @IsEmail()
    email: string

    @IsString({groups: ['update']})
    bio: string

    @IsString({groups: ['update']})
    profilePicturePath: string

    @IsBoolean({groups: ['registration', 'update']})
    gender: boolean

    @ValidateNested({groups: ['registration']})
    role: Role
}

