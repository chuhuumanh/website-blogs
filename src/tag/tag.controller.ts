import { Body, ConflictException, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
    async addTag(@Body(new ValidationPipe()) tag: TagDto){
        const isTagExist = await this.tagService.getTagByName(tag.name);
        if(isTagExist)
            throw new ConflictException('Tag is already exist !');
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

    @Patch(':id')
    async updateTag(@Body(new ValidationPipe()) tag: TagDto, @Param('id', ParseIntPipe) tagId: number){
        await this.tagService.findTagById(tagId);
        return await this.tagService.updateTag(tagId, tag)
    }

    @Delete(':id')
    async deleteTag(@Param('id', ParseIntPipe) tagId: number){
        return await this.tagService.deleteTag(tagId);
    }
    
}
