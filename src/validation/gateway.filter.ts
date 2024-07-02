import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(HttpException, WsException)
export class GateWayFilter<T> extends BaseWsExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const callback = host.getArgByIndex(2);
  if (callback && typeof callback === 'function') {
    callback(exception);
  }
  }
}
