import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './image.controller';
import { PostModule } from 'src/post/post.module';
import { CategoryModule } from 'src/category/category.module';
import { TagModule } from 'src/tag/tag.module';
import { UserModule } from 'src/user/user.module';
import { ImageService } from './image.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { Images } from './images';
import { DatetimeService } from 'src/datetime/datetime.service';


@Module({
    imports: [TypeOrmModule.forFeature([Images]), forwardRef(() => PostModule) , CategoryModule, TagModule, forwardRef(() => UserModule)],
    providers: [ImageService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [ImageController],
    exports: [ImageService]
})
export class ImageModule {}