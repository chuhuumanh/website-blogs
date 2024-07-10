import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
@Injectable()
export class ParseMessageBodyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
        return JSON.parse(value);
    } catch (err) {
        throw new BadRequestException('Invalid JSON data in form-data');
      }
  }
}
