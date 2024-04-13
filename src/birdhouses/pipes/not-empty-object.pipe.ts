import { BadRequestException, PipeTransform } from '@nestjs/common';

export class NotEmptyObjectPipe implements PipeTransform {
  transform(value: any /*, metadata: ArgumentMetadata */) {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException(`Empty object is not allowed`);
    }

    return value;
  }
}
