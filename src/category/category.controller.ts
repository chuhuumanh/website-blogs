import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/role/role.decorator';
import { CategoryDto } from 'src/validation/category.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { CategoryService } from './category.service';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService){}
    @Roles(Role.Admin)
    @Post()
    async addCategory(@Body(new ValidationPipe()) category: CategoryDto){
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
        const options = {
            name: keyword.name,
        }
        return await this.categoryService.findCategoryByName(options);
    }

    @Roles(Role.Admin)
    @Patch(':id')
    async updateCategory(@Body(new ValidationPipe()) category: CategoryDto, @Param('id', ParseIntPipe) categoryId: number){
        await this.categoryService.findCategoryById(categoryId)
        return await this.categoryService.updateCategory(categoryId, category)
    }

    @Roles(Role.Admin)
    @Delete(':id')
    async deleteCategory(@Param('id', ParseIntPipe) categoryId: number){
        await this.categoryService.findCategoryById(categoryId);
        return await this.categoryService.deleteCategory(categoryId);
    }
}
