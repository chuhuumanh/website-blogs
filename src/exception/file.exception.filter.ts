import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpCode, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs/promises'

@Catch(NotFoundException, ForbiddenException)
export class FileExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    let message = {};
    if(request['file']){
      await fs.unlink(`${request['file'].path}`);
      message = {Error: 'User not found !'};
    }
    else{
      for(const file of request['files']){
        console.log(file);
        await fs.unlink(`${file.path}`);
      }
      message = {Error: 'Post not found !'};
    }
    response.status(404).json(message);
  }
}
