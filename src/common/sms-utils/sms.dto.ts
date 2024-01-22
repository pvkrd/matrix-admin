import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SmsRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  toNumber: string;
  @ApiProperty({ type: String })
  @IsNotEmpty()
  smsMessage: string;
}
