import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { RoleModule } from 'src/role/role.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
@Module({
    imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => AuthModule)],
    providers: [CategoryService, JwtService, {provide: APP_GUARD, useClass: RoleGuard}],
    controllers: [CategoryController],
    exports: [CategoryService]
})
export class CategoryModule {}