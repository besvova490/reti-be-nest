import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// models
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.NEST_PORT || 3000);
}
bootstrap();
