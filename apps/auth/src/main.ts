import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const sharedService = app.get(SharedService);
  const configService = app.get(ConfigService);
  const queueName = configService.get('RABBITMQ_AUTH_QUEUE');
  const rmqOptions = sharedService.getRmqOptions(queueName);

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();