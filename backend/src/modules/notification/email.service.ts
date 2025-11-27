import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('sendgridApiKey');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  async sendInvitationEmail(to: string, inviteLink: string, role: string) {
    const apiKey = this.configService.get<string>('sendgridApiKey');
    if (!apiKey) {
      this.logger.warn(
        `SENDGRID_API_KEY missing. Skipping email send to ${to} for role ${role}. Link: ${inviteLink}`
      );
      return;
    }

    await sgMail.send({
      to,
      from: 'no-reply@meetingbooking.app',
      subject: 'You have been invited to Meeting Booking',
      html: `<p>You have been invited as <strong>${role}</strong>.</p><p><a href="${inviteLink}">Complete your signup</a>. The link expires in 48 hours.</p>`
    });
  }

  async sendMeetingUpdateEmail(to: string, subject: string, html: string) {
    const apiKey = this.configService.get<string>('sendgridApiKey');
    if (!apiKey) {
      this.logger.warn(`SENDGRID_API_KEY missing. Skipping meeting email to ${to}`);
      return;
    }

    await sgMail.send({
      to,
      from: 'no-reply@meetingbooking.app',
      subject,
      html
    });
  }
}

