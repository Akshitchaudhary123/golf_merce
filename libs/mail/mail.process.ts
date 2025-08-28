


// import { Worker } from 'bullmq';
// import { MailService } from './mail.service';
// import { Redis } from 'ioredis';

// // const connection = new Redis({
// //     host: process.env.REDIS_HOST || "default",
// //     port: Number(process.env.REDIS_PORT || 14332),
// //     // password: process.env.REDIS_PASSWORD || "TJ2cGZ4V4Ykmdk9FsU2A2wGVBTsSV8H8"
// // });


// const connection = new Redis({
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
//     username: process.env.REDIS_USERNAME || undefined, // optional
//     password: process.env.REDIS_PASSWORD,              // required if auth is enabled
// });


// const mailService = new MailService();

// export const emailWorker = new Worker(
//     'email-queue',
//     async (job) => {
//         const { to, subject, html } = job.data;
//         await mailService.sendEmail(to, subject, html);
//     },
//     { connection },
// );






import { Worker } from 'bullmq';
import { MailService } from './mail.service';
import { Redis } from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

// Minimal module just to provide ConfigService + MailService
@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [MailService],
})
class WorkerModule { }

async function bootstrapWorker() {
    // Create Nest app context (no HTTP server, just DI)
    const appContext = await NestFactory.createApplicationContext(WorkerModule);

    const configService = appContext.get(ConfigService);
    const mailService = appContext.get(MailService);

    const connection = new Redis({
        host: configService.get<string>('REDIS_HOST'),
        port: Number(configService.get<number>('REDIS_PORT')),
        username: configService.get<string>('REDIS_USERNAME') || undefined,
        password: configService.get<string>('REDIS_PASSWORD'),
    });

    new Worker(
        'email-queue',
        async (job) => {
            const { to, subject, html } = job.data;
            await mailService.sendEmail(to, subject, html);
        },
        { connection },
    );
}

bootstrapWorker();
