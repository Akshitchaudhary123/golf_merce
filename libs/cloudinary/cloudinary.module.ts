// cloudinary.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                join(process.cwd(), '.env'),              // global env
                join(process.cwd(), 'libs/.env'),  // service-specific env
            ], // 👈 ensures .env vars are loaded globally
        }),
    ],
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryProvider, CloudinaryService], // make them usable in other modules
})
export class CloudinaryModule { }
