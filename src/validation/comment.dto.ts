import { ActivityDto } from "./activity.dto";
import { IsString, IsNotEmpty } from "@nestjs/class-validator";

export class CommentDto extends ActivityDto{
    @IsString()
    @IsNotEmpty()
    comment?: string
}