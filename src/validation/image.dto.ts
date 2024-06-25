import { IsDate, IsNumber, IsString} from "class-validator";

export enum fileType{
    bmp = "bmp",
    webp = "webp",
    png = "png",
    jpeg = "jpeg"
}

export class ImageDto{

    @IsNumber()
    postId: number

    filePath: string
    size: number
    fileType: string

}