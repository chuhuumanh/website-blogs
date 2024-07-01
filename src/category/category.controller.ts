import { Controller, Post, Get, Patch, Delete, Body, Query, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { CategoryDto } from 'src/validation/category.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/role/role.decorator';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService){}
    @Roles(Role.Admin)
    @Post()
    addCategory(@Body(new ValidationPipe()) category: CategoryDto){
        return this.categoryService.add(category);
    }

    @Get()
    getCategory(@Query() keyword: {name?:string} ){
        return this.categoryService.findCategoryByName(keyword.name);
    }
    @Roles(Role.Admin)
    @Patch(':id')
    updateTag(@Body(new ValidationPipe()) category: CategoryDto, @Param('id', ParseIntPipe) categoryId: number){
        return this.categoryService.updateCategory(categoryId, category)
    }
    @Roles(Role.Admin)
    @Delete(':id')
    deleteTag(@Param('id', ParseIntPipe) categoryId: number){
        return this.categoryService.deleteCategory(categoryId);
    }
}
