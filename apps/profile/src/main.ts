import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile.module';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);
  const sharedService = app.get(SharedService);
  const configService = app.get(ConfigService);
  const queueName = configService.get('RABBITMQ_AUTH_QUEUE');
  const rmqOptions = sharedService.getRmqOptions(queueName);

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();