import { BadRequestException, Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { Images } from './images.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Images]),  
        MulterModule.register({
            dest: 'public/images',
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/^(image\/jpeg|image\/png|image\/gif|image\/bmp)$/i)) {
                    callback(new BadRequestException("Only jpeg, jpg, gif, bmp files are allow"), false);
                }
                else callback(null, true)
            },
        }
    ), forwardRef(() => PostModule), forwardRef(() => UserModule)],
    providers: [ImageService],
    controllers: [ImageController],
    exports: [ImageService]
})
export class ImageModule {}