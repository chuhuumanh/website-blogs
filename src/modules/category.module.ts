import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from 'src/controllers/category.controller';
import { Category } from 'src/entity/category';
import { CategoryService } from 'src/services/category.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoryService],
    controllers: [CategoryController]
})
export class CategoryModule {}
