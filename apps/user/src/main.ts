// import { NestFactory } from '@nestjs/core';
// import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
// import { UserModule } from './user.module';

// async function bootstrap() {
//   const app = await NestFactory.create<NestFastifyApplication>(
//     UserModule,
//     new FastifyAdapter(),
//   );

//   await app.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 3001, '0.0.0.0');
// }
// bootstrap();



import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    UserModule,
    new FastifyAdapter(),
  );

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
