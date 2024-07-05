import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

export class ParsePaginatePipe implements PipeTransform {
  transform(value: any, { type }: ArgumentMetadata) {
    try{
        value.page = Number(value.page);
        value.take = Number(value.take);
        return value;
    }
    catch{
        throw new BadRequestException('Page and Take must be numeric !');
    }
  }
}