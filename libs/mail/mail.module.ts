// libs/mail/mail.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailWorkerService } from './mail-worker.service';

@Global() // makes MailService available globally
@Module({
    imports: [

        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: __dirname + '/../../.env', // go up 3 levels to golf/.env

        }),
    ],
    providers: [MailService,MailWorkerService],
    exports: [MailService],
})
export class MailModule { }
