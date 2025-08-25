import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';
import { join } from 'path';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly transporter: nodemailer.Transporter;
    private readonly emailQueue: Queue;

    constructor() {
        // Load .env from libs/mail/ instead of root
        dotenv.config({ path: join(__dirname, '../../.env') });

        // Nodemailer transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });

        // Redis connection for queue
        const connection = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
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
                from: process.env.EMAIL_FROM,
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