import { NestFactory } from '@nestjs/core';

// modules
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const seederService = appContext.get(SeederService);

  console.log('Seeding data...');
  await seederService.seed();
  console.log('Done!');
}

bootstrap();
