import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseMessageBodyBoolPipe implements PipeTransform {
  constructor(private keyName: string){}
  transform(value: object, metadata: ArgumentMetadata) {
    if(typeof value[this.keyName] !== 'boolean')
      throw new BadRequestException('Except boolean type !');
    return value[this.keyName];
  }
}
