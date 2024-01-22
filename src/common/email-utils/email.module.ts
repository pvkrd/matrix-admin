import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailService } from '@sendgrid/mail';
import { LoggerService } from '../logging/logging.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService, MailService, LoggerService],
  exports: [EmailService],
})
export class EmailModule { }
