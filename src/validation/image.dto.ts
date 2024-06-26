import { IsDate, IsNumber, IsString} from "class-validator";

export class ImageDto{

    @IsNumber()
    postId: number

    filePath: string
    size: number
    fileType: string

}