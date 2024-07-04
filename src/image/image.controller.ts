import { Controller, Get, Res, Req, Query, ParseIntPipe, UseGuards, Param} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { Role, Roles } from 'src/role/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('images')
@UseGuards(AuthGuard)
@Roles(Role.Admin, Role.User)
export class ImageController {
    constructor(private imgService: ImageService, private userService: UserService){}
    @Get()
    get(){
        return"Hello"
    }
    @Get(':path(*)')
    async getImages(@Res({ passthrough: true }) res: Response, @Req() req: Request){
        // tìm hiểu sử dụng package path để lấy đường dẫn , k nên xử lý cắt chuỗi kiểu này https://nodejs.org/docs/latest/api/path.html
        const path = req.url;
        const pathSplit = path.split('/');
        const filePath = `${pathSplit[2]}\\${pathSplit[3]}\\${pathSplit[4]}`;
        await this.imgService.getPostImagesByPath(filePath);
        res.set({
            'Content-Type': `image/jpeg`,
            'Content-Disposition': 'attachment;',
        });
        const stream = createReadStream(join(process.cwd(), filePath));
        return new StreamableFile(stream);
    }
}
