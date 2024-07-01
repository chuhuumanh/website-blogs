import { ArrayMinSize, IsArray, IsOptional, IsString} from "@nestjs/class-validator";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PostDto{
    @IsNotEmpty()
    @IsString()
    title?: string

    @IsNotEmpty()
    @IsString()
    content?: string

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
