import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// models
import { AppModule } from './app.module';

// helpers
import { serializeValidationError } from './helpers/serialize-validation-error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: serializeValidationError,
    }),
  );

  await app.listen(process.env.NEST_PORT || 3000);
}
bootstrap();
