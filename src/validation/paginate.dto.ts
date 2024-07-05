import { IsNotEmpty, IsNumber, Min } from "@nestjs/class-validator";
import { IsOptional, IsString } from "class-validator";

export class PaginateDto{
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    page: number
    
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    take: number

    @IsOptional()
    @IsString()
    keyword: string
}