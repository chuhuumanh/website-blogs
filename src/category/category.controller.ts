import { Controller, Post, Get, Patch, Delete, Body, Query, Param, ParseIntPipe, UseGuards, NotAcceptableException, ConflictException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { CategoryDto } from 'src/validation/category.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/role/role.decorator';

@UseGuards(AuthGuard)
@Roles(Role.Admin)
@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService){}
    @Post()
    async addCategory(@Body(new ValidationPipe()) category: CategoryDto){
        const isCategoryExist = await this.categoryService.findCategoryByName(category.name);
        if(isCategoryExist)
            throw new ConflictException('Category is already exist !');
        return await this.categoryService.add(category);
    }

    @Roles(Role.User)
    @Get(':id')
    async getCategoryById(@Param('id', ParseIntPipe) id: number){
        return await this.categoryService.findCategoryById(id)
    }

    @Roles(Role.User)
    @Get()
    async getCategory(@Query() keyword: {name?:string} ){
        return await this.categoryService.findCategoryByName(keyword.name);
    }
    @Patch(':id')
    async updateCategory(@Body(new ValidationPipe()) category: CategoryDto, @Param('id', ParseIntPipe) categoryId: number){
        await this.categoryService.findCategoryById(categoryId)
        return await this.categoryService.updateCategory(categoryId, category)
    }
    @Delete(':id')
    async deleteCategory(@Param('id', ParseIntPipe) categoryId: number){
        await this.categoryService.findCategoryById(categoryId);
        return await this.categoryService.deleteCategory(categoryId);
    }
}
