import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { SharedModule, SharedService } from '@app/shared';

async function bootstrap() {
  console.log(SharedModule.getTypeormModule('POSTGRES_USER_DB'));
  const app = await NestFactory.create(AuthModule);
  const sharedService = app.get(SharedService);
  const configService = app.get(ConfigService);
  const queueName = configService.get('RABBITMQ_AUTH_QUEUE');
  const rmqOptions = sharedService.getRmqOptions(queueName);

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();