import { IsString} from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Images } from "src/entity/images";
import { Tags } from "src/entity/tags";

export class PostDto{
    @IsString()
    title?: string

    @IsString()
    content?: string

    @IsNotEmpty()
    @IsNumber()
    userId?: number

    @IsNotEmpty()
    @IsNumber()
    accessId?: number

    likeCount?:number
    shareCount?: number
    saveCount?: number
    commentCount?: number
    tags?: Tags[]
}
