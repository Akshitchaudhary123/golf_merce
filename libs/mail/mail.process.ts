


import { Worker } from 'bullmq';
import { MailService } from './mail.service';
import { Redis } from 'ioredis';

const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
});

const mailService = new MailService();

export const emailWorker = new Worker(
    'email-queue',
    async (job) => {
        const { to, subject, html } = job.data;
        await mailService.sendEmail(to, subject, html);
    },
    { connection },
);
