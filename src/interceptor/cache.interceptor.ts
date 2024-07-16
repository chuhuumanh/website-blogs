import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class CacheKeysInterceptor extends CacheInterceptor{
  trackBy(context: ExecutionContext): string | undefined{
    const request = context.switchToHttp().getRequest();
    const key = request.originalUrl;
    return key;
  }
}
