// main.ts
import { NestFactory } from '@nestjs/core';
import { UploadModule } from './upload.module';

async function bootstrap() {
  // By default Nest uses Express, so no adapter is needed
  const app = await NestFactory.create(UploadModule);

  await app.listen(process.env.PORT ?? 3002);
  console.log(`🚀 Upload Server running at http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();
