import { Queue } from 'bullmq';
export declare class MailService {
    private readonly mailQueue;
    constructor(mailQueue: Queue);
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
}
