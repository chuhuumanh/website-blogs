import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from 'src/controllers/category.controller';
import { Category } from 'src/entity/category';
import { CategoryService } from 'src/services/category.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoryService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [CategoryController]
})
export class CategoryModule {}
