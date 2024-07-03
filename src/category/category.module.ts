import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category';
import { CategoryService } from './category.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { CategoryController } from './category.controller';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports: [TypeOrmModule.forFeature([Category]), RoleModule, AuthModule],
    providers: [CategoryService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [CategoryController],
    exports: [CategoryService]
})
export class CategoryModule {}