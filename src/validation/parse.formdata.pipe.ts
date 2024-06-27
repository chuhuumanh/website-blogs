import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseFormDataPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.table(value);
    try {
        return JSON.parse(value.request);
    } catch (err) {
      console.log(err)
        throw new BadRequestException('Invalid JSON data in form-data');
      }
  }
}
