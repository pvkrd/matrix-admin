import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string, string> {
  /**
   * Transforms the input value to a valid ObjectId string.
   * Throws a BadRequestException if the input value is not a valid ObjectId.
   * @param value The input value to transform.
   * @param metadata The metadata about the input value.
   * @returns The transformed value.
   */
  transform(value: string, metadata: ArgumentMetadata): string {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;

    // Check if the input value matches the ObjectId pattern.
    if (!objectIdPattern.test(value)) {
      throw new BadRequestException('Invalid ObjectId format');
    }

    // Return the input value if it is a valid ObjectId.
    return value;
  }
}
