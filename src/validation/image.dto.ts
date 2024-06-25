import { IsDate, IsNumber, IsString} from "class-validator";

export class ImageDto{

    @IsNumber()
    postId: number

    @IsString()
    imgPath: string

    @IsString()
    fileType: string

    @IsNumber()
    size: number

}