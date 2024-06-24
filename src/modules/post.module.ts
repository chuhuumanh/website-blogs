import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from 'src/controllers/post.controller';
import { Posts } from 'src/entity/posts';
import { PostService } from 'src/services/post.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';
import { DatetimeService } from 'src/services/datetime.service';

@Module({
    imports: [TypeOrmModule.forFeature([Posts])],
    providers: [PostService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [PostController]
})
export class PostModule {}
