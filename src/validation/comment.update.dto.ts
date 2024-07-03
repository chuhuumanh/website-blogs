import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CommentUpdateDto{
    @IsString()
    @IsNotEmpty()
    content: string

    userId: number
}