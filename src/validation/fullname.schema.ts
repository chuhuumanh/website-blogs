import { IsString } from "class-validator"

export class createFullNameDto{
    @IsString()
    firstName: string;

    @IsString()
    lastName: string
}