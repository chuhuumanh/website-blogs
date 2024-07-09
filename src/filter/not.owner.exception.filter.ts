import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpCode, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs/promises'

@Catch(ForbiddenException)
export class NotOwnerException implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    console.log(exception);
    const message = {message: exception.message};
    if(request['file']){
      await fs.unlink(`${request['file'].path}`);
    }
    else{
      for(const file of request['files']){
        await fs.unlink(`${file.path}`);
      }
    }
    response.status(status).json(message);
  }
}
