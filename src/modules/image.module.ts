import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from 'src/controllers/image.controller';
import { Images } from 'src/entity/images';
import { Posts } from 'src/entity/posts';
import { DatetimeService } from 'src/services/datetime.service';
import { ImageService } from 'src/services/image.service';
import { PostService } from 'src/services/post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Images, Posts])],
    providers: [ImageService, DatetimeService, PostService],
    controllers: [ImageController]
})
export class ImageModule {}
