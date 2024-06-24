import { Controller, Post, Get, Patch, Delete, Body, Query, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from 'src/services/category.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { CategoryDto } from 'src/validation/category.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/auth/role.decorator';

@UseGuards(AuthGuard)
@Roles(Role.User)
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService){}
    @Post()
    addCategory(@Body(new ValidationPipe(undefined)) category: CategoryDto){
        return this.categoryService.Add(category);
    }

    @Get()
    getCategory(@Query() keyword: {name?:string} ){
        return this.categoryService.FindCategory(keyword.name);
    }

    @Patch(':id')
    updateTag(@Body(new ValidationPipe(undefined)) category: CategoryDto, @Param('id', ParseIntPipe) categoryId: number){
        return this.categoryService.UpdateCategory(categoryId, category)
    }

    @Delete(':id')
    deleteTag(@Param('id', ParseIntPipe) categoryId: number){
        return this.categoryService.deleteCategory(categoryId);
    }
}
