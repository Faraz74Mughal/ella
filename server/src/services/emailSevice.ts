import { Resend } from 'resend';
import config from '../config/config';
import { userVerifyTemplate } from '../templates/mailTemplates/userVerifyTemplate';
import { logger } from '../utils/logger';

class EmailService {
  private resend: Resend;
  private companyName: string;
  private companyEmail: string;
  private supportEmail: string;

  constructor() {
    this.resend = new Resend(config.emailKey);
    this.companyName = config.companyName;
    this.companyEmail = config.companyEmail;
    this.supportEmail = config.supportEmail;
  }

  async sendVerifyEmail(userName: string, userEmail: string, link: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.companyEmail,
        to: [userEmail],
        subject: 'Verify User',
        html: userVerifyTemplate(userName, this.companyName, link, this.supportEmail),
      });

      if (data) {
        logger.info('Mail Data: ', data);
      }
      if (error) {
        throw error;
      }
    } catch (error) {
      logger.error('Sending mail error: ',error);
    }
  }
}

export const emailService = new EmailService();
