import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

// Define the UuidValidationPipe class
@Injectable()
export class UuidValidationPipe implements PipeTransform<string> {
  // The transform method is called when the pipe is used
  async transform(value: string, metadata: ArgumentMetadata) {
    // Use the validate function from the uuid package to check if the value is a valid UUID
    if (uuidVersion(value) !== 4) {
      throw new BadRequestException('Invalid UUIDv4 format');
    }
    // If the value is a valid UUID, return it unchanged
    return value;
  }
}