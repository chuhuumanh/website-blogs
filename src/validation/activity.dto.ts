import { IsNotEmpty, IsNumber, IsOptional } from "@nestjs/class-validator";
import { Type } from "class-transformer";
import { IsString } from "class-validator";
import { number } from "zod";

export class ActivityDto{
    @IsNotEmpty({groups: ['insert', 'update']})
    @IsNumber({}, {groups: ['insert', 'update']})
    userId: number

    @IsNotEmpty({groups: ['insert']})
    @IsNumber({}, {groups: ['insert']})
    postId: number

    @IsOptional({groups: ['insert', 'update']})
    @IsNotEmpty({groups: ['insert', 'update']})
    @IsString({groups: ['insert', 'update']})
    content: string
}