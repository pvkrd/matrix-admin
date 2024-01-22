import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { LoggerService } from '../logging/logging.service';

@Injectable()
export class SmsService {
  constructor(
    private readonly twilioClient: Twilio,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) { }

  /**
   * Sends an SMS message to a phone number using the Twilio API.
   * Retries up to 3 times if sending fails.
   * Throws an error if sending fails after 3 attempts.
   * @param toNumber The phone number to send the SMS to.
   * @param smsMessage The message to send.
   * @returns The response from the Twilio API.
   */
    async sendSms(
        toNumber : string,
        smsMessage : string
    ) {
       this.logger.info(`Sending SMS`);
        try {
            // Send SMS
            const response = await this.twilioClient.messages.create({
                from : this.configService.get<string>('TWILIO_SMS_SENDER_NUMBER'),
                to : toNumber,
                body : smsMessage,
                attempt : this.configService.get<number>('TWILIO_SMS_RETRY_COUNT')
            });
             this.logger.debug(`\nTwilio SMS ResponseID : ${response.sid}, toNumber : ${toNumber}`);
            return response;
        } catch (error) {
             this.logger.error(`Error sending SMS: ${error.message}`);
        }
    }
};
