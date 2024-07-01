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
    addCategory(@Body(new ValidationPipe(undefined)) category: CategoryDto){
        return this.categoryService.Add(category);
    }

    @Get()
    getCategory(@Query() keyword: {name?:string} ){
        return this.categoryService.FindCategoryByName(keyword.name);
    }
    @Roles(Role.Admin)
    @Patch(':id')
    updateTag(@Body(new ValidationPipe(undefined)) category: CategoryDto, @Param('id', ParseIntPipe) categoryId: number){
        return this.categoryService.UpdateCategory(categoryId, category)
    }
    @Roles(Role.Admin)
    @Delete(':id')
    deleteTag(@Param('id', ParseIntPipe) categoryId: number){
        return this.categoryService.DeleteCategory(categoryId);
    }
}
