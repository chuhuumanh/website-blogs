import { IsNotEmpty, IsNumber, IsOptional } from "@nestjs/class-validator";
import { IsString } from "class-validator";

export class ActivityDto{
    @IsNumber()
    userId: number

    @IsNumber()
    postId: number

}