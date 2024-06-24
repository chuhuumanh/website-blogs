import { IsString, ValidateNested } from "@nestjs/class-validator";
import { IsNotEmpty, IsNumber } from "class-validator";


class Image{
    id: number
    imgPath: string
    uploadedDate: Date
    fileType: string
    size: number
}

export class PostDto{
    @IsString()
    title: string

    @IsString()
    content: string
    

    @IsNotEmpty()
    @IsNumber()
    userId: number

    @IsNotEmpty()
    @IsNumber()
    accessId: number

    images: Image[]
    likeCount:number
    shareCount: number
    saveCount: number
    commentCount: number
}