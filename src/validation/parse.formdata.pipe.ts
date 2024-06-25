import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseFormDataPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
        return JSON.parse(value.request);
    } catch (err) {
        throw new BadRequestException('Invalid JSON data in form-data');
      }
  }
}
