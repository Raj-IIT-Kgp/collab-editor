import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async sendVerificationEmail(email: string, token: string) {
    await this.mailQueue.add('verification-email', {
      email,
      token,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    await this.mailQueue.add('password-reset-email', {
      email,
      token,
    });
  }
}
