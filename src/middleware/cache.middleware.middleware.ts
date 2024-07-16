import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
@Injectable()
export class CacheMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache){}
  async use(req: Request, res: Response, next: () => void) {
    const cacheKeys = await this.cacheManager.store.keys();
    if(cacheKeys.length){
      console.log('Cache memories: ')
      cacheKeys.forEach(async(key) =>{
        console.log(key, await this.cacheManager.get(key));
      });
    }
    next();
  }
}
