import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { boolean } from 'zod';

@Injectable()
export class ParseMessageBodyBoolPipe implements PipeTransform {
  constructor(private keyName: string){}
  transform(value: object, metadata: ArgumentMetadata) {
    console.log(value[this.keyName]);
    if(typeof value[this.keyName] !== 'boolean')
      throw new BadRequestException('Except boolean type !');
    return value[this.keyName];
  }
}
