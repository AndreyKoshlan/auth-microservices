import { NestFactory } from '@nestjs/core';
import { ProfileModule } from './profile.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}

bootstrap();