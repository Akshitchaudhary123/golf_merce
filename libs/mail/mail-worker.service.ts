
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Worker } from 'bullmq';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class MailWorkerService implements OnModuleInit {
    private readonly logger = new Logger(MailWorkerService.name);

    constructor(
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
    ) { }

    onModuleInit() {
        const connection = new Redis({
            host: this.configService.get<string>('REDIS_HOST'),
            port: Number(this.configService.get<number>('REDIS_PORT')),
            password: this.configService.get<string>('REDIS_PASSWORD'),
            maxRetriesPerRequest: null,   // 🔑 required for BullMQ
        });


        new Worker(
            'email-queue',
            async (job) => {
                this.logger.log(`Processing job ${job.id} for ${job.data.to}`);
                const { to, subject, html } = job.data;
                await this.mailService.sendEmail(to, subject, html);
            },
            { connection },
        );

        this.logger.log('📩 Mail worker started and listening for jobs...');
    }
}
