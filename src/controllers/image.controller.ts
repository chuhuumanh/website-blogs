import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ImageService } from 'src/services/image.service';
import { ImageDto } from 'src/validation/image.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';

@Controller('image')
export class ImageController {
    constructor(private imageService: ImageService){}
    @Post()
    async addImgPost(@Body(new ValidationPipe()) imgDto: ImageDto){
        return await this.imageService.AddPostImage(imgDto);
    }

}
