// libs/mail/mail.module.ts
import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';

@Global() // Add this decorator
@Module({
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }