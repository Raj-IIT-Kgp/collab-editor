import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'verification-email':
        this.logger.log(`Sending verification email to ${job.data.email} with token ${job.data.token}`);
        // Simulate email sending
        await new Promise((resolve) => setTimeout(resolve, 1000));
        break;
      case 'password-reset-email':
        this.logger.log(`Sending password reset email to ${job.data.email} with token ${job.data.token}`);
        // Simulate email sending
        await new Promise((resolve) => setTimeout(resolve, 1000));
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }
}
