import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { AuthGuard } from 'src/auth-module/auth.guard';
import { LoggerService } from 'src/common/logging/logging.service';
import { SmsRequest } from './sms.dto';

@ApiTags('Send SMS')
@Controller('sendSms')
export class SmsController {
  constructor(
    private readonly smsService: SmsService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * An API that takes recipient phone number and SMS Message as input and sends SMS respectively.
   * @param {string} authToken - The authentication token. 
   * @param {SmsRequest} smsRequest - The SmsRequest Object having the recipient details and SMS Message.
   * @returns {Promise<boolean>} - A boolean promise indicating the successful delivery of the SMS Message.
   */
  @UseGuards(AuthGuard)
  @Post()
  async sendSms(
    @Headers('authToken') authToken: string,
    @Body() smsRequest: SmsRequest,
  ): Promise<boolean> {
    try {
      this.logger.info(
        `Sending SMS to ${smsRequest.toNumber}, SMS Message : ${smsRequest.smsMessage}`,
      );
      await this.smsService.sendSms(smsRequest.toNumber, smsRequest.smsMessage);
      return true;
    } catch (error) {
      this.logger.error(
        `Error sending SMS to ${smsRequest.toNumber}, ErrorMessage : ${error}`,
      );
      throw error;
    }
  }
}
