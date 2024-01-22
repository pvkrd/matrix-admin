import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { Twilio } from 'twilio';
import { LoggerService } from '../logging/logging.service';

@Module({
    controllers: [SmsController],
    providers: [SmsService, Twilio, LoggerService],
    exports: [SmsService],
})
export class SmsModule { }