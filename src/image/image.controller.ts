import { Controller, Get, Res, Req, UseGuards, Param} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { Role, Roles } from 'src/role/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import * as path from 'path'
@Controller('resource')
@UseGuards(AuthGuard)
@Roles(Role.Admin, Role.User)
export class ImageController {
    constructor(private imgService: ImageService, private userService: UserService){}
    @Get(':path(*)')
    async getImages(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('path') imgPath: string){
        const filePath = path.join(imgPath);
        const file = await this.imgService.getPostImagesByPath(filePath);
        console.log(file)
        res.set({
            'Content-Type': `${file.mimetype}`,
            'Content-Disposition': 'attachment;',
        });
        const stream = createReadStream(join(process.cwd(), filePath));
        return new StreamableFile(stream);
    }
}
