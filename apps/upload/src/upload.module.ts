import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { UploadController } from './upload.controller';
import { CloudinaryModule } from '../../../libs/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: __dirname + '/../../../.env', // go up 3 levels to golf/.env

      // envFilePath: __dirname + '/../../../.env',

      // envFilePath: '.env'
    }),

    // envFilePath: [
    //   join(process.cwd(), '.env'),              // global env
    //   join(process.cwd(), 'apps/upload/.env'),  // service-specific env
    // ],
    // }),



    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: [__dirname + '/../.env', __dirname + '/../../../.env'],
    // }),

    CloudinaryModule, // import cloudinary so service is available
  ],
  controllers: [UploadController], // register controller
})
export class UploadModule { }
