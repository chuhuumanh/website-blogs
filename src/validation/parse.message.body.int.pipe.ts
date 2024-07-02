import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ParseMessageBodyIntPipe implements PipeTransform {
  constructor(private keyName: string){}
  transform(value: object, metadata: ArgumentMetadata) {
    try{
      return parseInt(value[this.keyName]);
    }
    catch{
      throw new BadRequestException('Expect numeric type !');
    }
  }
}
