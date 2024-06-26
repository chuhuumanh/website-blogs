import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { TagService } from './tag.service';
import { TagDto } from 'src/validation/tag.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';

@Controller('tags')
@UseGuards(AuthGuard)
@Roles(Role.Admin, Role.User)
export class TagController {
    constructor(private tagService: TagService){}
    @Post()
    addTag(@Body(new ValidationPipe()) tag: TagDto){
        return this.tagService.add(tag);
    }

    @Get()
    getTag(@Query() keyword: {name?:string} ){
        return this.tagService.findTag(keyword.name);
    }

    @Patch(':id')
    updateTag(@Body(new ValidationPipe()) tag: TagDto, @Param('id', ParseIntPipe) tagId: number){
        return this.tagService.updateTag(tagId, tag)
    }

    @Delete(':id')
    deleteTag(@Param('id', ParseIntPipe) tagId: number){
        return this.tagService.deleteTag(tagId);
    }
    
}
