import { Controller, Get, Res, Req, Query, ParseIntPipe} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { Role, Roles } from 'src/role/role.decorator';
@Controller('images')
@Roles(Role.Admin, Role.User)
export class ImageController {
    constructor(private imgService: ImageService, private userService: UserService){}
    @Get('/postsImg/:fileName')
    async getPostImages(@Res({ passthrough: true }) res: Response, @Req() req: Request){
        const path = req.url;
        const pathSplit = path.split('/');
        const filePath = `${pathSplit[1]}\\${pathSplit[2]}\\${pathSplit[3]}`
        await this.imgService.getPostImagesByPath(filePath);
        res.set({
            'Content-Type': `image/jpeg`,
            'Content-Disposition': 'attachment;',
        });
        const stream = createReadStream(join(process.cwd(), filePath));
        return new StreamableFile(stream);
    }

    @Get('/usersImg/:fileName')
    async getUsersImage(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Query('userId', ParseIntPipe) userId: number){
        const path = req.url;
        const pathSplit = path.split('/');
        const filePath = `${pathSplit[1]}\\${pathSplit[2]}\\${pathSplit[3].split('?')[0]}`
        await this.userService.findUserProfilePicture(userId, filePath);
        res.set({
            'Content-Type': `image/jpeg`,
            'Content-Disposition': 'attachment;',
        });
        const stream = createReadStream(join(process.cwd(), filePath));
        return new StreamableFile(stream);
    }
    
}
