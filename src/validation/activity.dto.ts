import { IsNumber } from "@nestjs/class-validator";

export class ActivityDto{
    @IsNumber()
    userId: number

    @IsNumber()
    postId: number
}