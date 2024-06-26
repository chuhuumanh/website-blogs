import { ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested, arrayMinSize} from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Images } from "src/entity/images";
import { Tags } from "src/entity/tags";
import { number } from "zod";

export class PostDto{
    @IsNotEmpty()
    @IsString()
    title?: string

    @IsNotEmpty()
    @IsString()
    content?: string

    @IsNotEmpty()
    @IsNumber()
    userId?: number

    @IsNotEmpty()
    @IsNumber()
    accessId?: number

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsNumber({}, {each: true})
    categoriesId?: number[]

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, {each: true})
    tagsId?: number[]


    likeCount?:number
    shareCount?: number
    saveCount?: number
    commentCount?: number
}
