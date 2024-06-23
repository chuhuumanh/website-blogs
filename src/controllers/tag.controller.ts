import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/auth/role.decorator';
import { TagService } from 'src/services/tag.service';
import { TagDto } from 'src/validation/tag.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';

@Controller('tag')
@UseGuards(AuthGuard)
@Roles(Role.Admin)
export class TagController {
    constructor(private tagService: TagService){}
    @Post()
    addTag(@Body(new ValidationPipe(undefined)) tag: TagDto){
        return this.tagService.Add(tag);
    }

    @Get()
    getAllTag(@Query() keyword: {name?:string} ){
        return this.tagService.FindTag(keyword.name);
    }

    
}
