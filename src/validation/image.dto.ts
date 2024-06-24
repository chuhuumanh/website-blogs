import { IsDate, IsNumber, IsString} from "class-validator";

export class ImageDto{

    @IsString()
    imgPath: string

    @IsDate()
    uploadedDate: Date

    @IsString()
    fileType: string

    @IsNumber()
    size: number
}