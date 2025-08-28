import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly transporter: nodemailer.Transporter;
    private readonly emailQueue: Queue;

    constructor(private readonly configService: ConfigService) {
        // Nodemailer transporter
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: Number(this.configService.get<number>('EMAIL_PORT')),
            secure: this.configService.get<string>('EMAIL_PORT') === '465',
            auth: {
                user: this.configService.get<string>('NODEMAILER_EMAIL'),
                pass: this.configService.get<string>('NODEMAILER_PASSWORD'),
            },
        });

        // Redis connection for queue
        const connection = new Redis({
            host: this.configService.get<string>('REDIS_HOST'),
            port: Number(this.configService.get<number>('REDIS_PORT')),
            password: this.configService.get<string>('REDIS_PASSWORD'), // if you need
        });

        this.emailQueue = new Queue('email-queue', { connection });
    }

    // Add job to queue
    async enqueueEmail(to: string, subject: string, html: string) {
        await this.emailQueue.add('send-email', { to, subject, html });
        this.logger.log(`Email enqueued for ${to}`);
    }

    // Send email immediately (used by worker)
    async sendEmail(to: string, subject: string, html: string) {
        try {
            await this.transporter.sendMail({
                from: this.configService.get<string>('EMAIL_FROM'),
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error.stack);
            throw error;
        }
    }
}
