import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpCode, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs/promises'

@Catch(NotFoundException)
export class FileExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let message = {};
    console.log(exception);
    if(request['file']){
      await fs.unlink(`${request['file'].path}`);
      message = {Error: 'User not found !'};
    }
    else{
      for(const file of request['files']){
        await fs.unlink(`${file.path}`);
      }
      message = {Error: 'Post not found !'};
    }
    response.status(status).json(message);
  }
}
