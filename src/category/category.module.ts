import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
@Module({
    imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => AuthModule)],
    providers: [CategoryService, JwtService],
    controllers: [CategoryController],
    exports: [CategoryService]
})
export class CategoryModule {}