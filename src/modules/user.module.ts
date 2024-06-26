import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';
import { PostService } from 'src/services/post.service';
import { Posts } from 'src/entity/posts';
import { DatetimeService } from 'src/services/datetime.service';
import { CategoryService } from 'src/services/category.service';
import { Category } from 'src/entity/category';
import { Tags } from 'src/entity/tags';
import { TagService } from 'src/services/tag.service';

@Module({
    imports: [TypeOrmModule.forFeature([Users, Posts, Category, Tags])],
    exports: [UserService],
    providers: [UserService, PostService, DatetimeService, CategoryService, TagService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [UserController]
})
export class UserModule {}
