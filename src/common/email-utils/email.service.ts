import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { LoggerService } from '../logging/logging.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly sendGridMailerService: MailService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.sendGridMailerService.setApiKey(
      this.configService.get<string>('SENDGRID_API_KEY'),
    );
  }

  /**
   * Sends an email using SendGrid's API.
   * Retries up to 3 times if sending fails.
   * Throws an error if sending fails after 3 attempts.
   * @param toEmail The email address to send the email to.
   * @param templateId The ID of the SendGrid email template to use.
   * @param templateVariables The variables to use in the email template.
   */
  async sendEmail(
    toEmail: string[],
    templateId: string,
    templateVariables: any,
  ) {
    const maxRetries = 3; // You can adjust the number of retries as needed
    let retryCount = 0;
    let success = false;

    this.logger.info(`Sending email to ${toEmail}`);

    while (retryCount < maxRetries && !success) {
      try {
        this.logger.debug(`Sending email attempt ${retryCount + 1}`);
        const msg = {
          to: toEmail,
          from: {
            name: this.configService.get<string>('EMAIL_SENDER_NAME'),
            email: this.configService.get<string>('EMAIL_SENDER_ADDRESS')
          },
          templateId: templateId,
          dynamicTemplateData: templateVariables,
        };
        await this.sendGridMailerService.send(msg);
        success = true;
        this.logger.debug(`Email sent to ${toEmail}`);
      } catch (error) {
        this.logger.error(`Error sending email to ${toEmail}: ${error.message}`);
        retryCount++;
      }
    }

    if (!success) {
      this.logger.error(`Failed to send email to ${toEmail} after ${maxRetries} attempts`);
      throw new Error(`Failed to send email to ${toEmail} after ${maxRetries} attempts`);
    }

    this.logger.info(`Email sent to ${toEmail}`);
  }
}