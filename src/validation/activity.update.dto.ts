import { IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator"
export class ActivityUpdateDto{
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    content: string

    @IsNotEmpty()
    @IsString()
    action: string

    userId: number
}