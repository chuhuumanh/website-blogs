import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category';
import { CategoryService } from './category.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { CategoryController } from './category.controller';
@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoryService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [CategoryController],
    exports: [CategoryService]
})
export class CategoryModule {}