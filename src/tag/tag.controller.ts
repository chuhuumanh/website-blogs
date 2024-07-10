import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TagDto } from 'src/validation/tag.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TagService } from './tag.service';

@Controller('tags')
@UseGuards(AuthGuard)
export class TagController {
    constructor(private tagService: TagService){}

    @Post()
    async addTag(@Body(new ValidationPipe()) tag: TagDto){
        return this.tagService.add(tag);
    }

    @Get()
    async getTag(@Query() keyword: {name?:string} ){
        return await this.tagService.findTag(keyword.name);
    }

    @Get(':id')
    async getTagById(@Param('id', ParseIntPipe) id: number){
        return await this.tagService.findTagById(id);
    }

    //@Roles(Role.Admin)
    @Patch(':id')
    async updateTag(@Body(new ValidationPipe()) tag: TagDto, @Param('id', ParseIntPipe) tagId: number){
        return await this.tagService.updateTag(tagId, tag)
    }

    //@Roles(Role.Admin)
    @Delete(':id')
    async deleteTag(@Param('id', ParseIntPipe) tagId: number){
        return await this.tagService.deleteTag(tagId);
    }
    
}
