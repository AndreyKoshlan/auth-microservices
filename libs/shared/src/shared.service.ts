import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class SharedService {
    constructor(private readonly configService: ConfigService) {}

    getRmqOptions(queueName: string): RmqOptions {
        const rabbitmqHost = this.configService.get('RABBITMQ_HOST');
        const rabbitmqPort = this.configService.get('RABBITMQ_PORT');
        const rabbitmqUser = this.configService.get('RABBITMQ_USER');
        const rabbitmqPassword = this.configService.get('RABBITMQ_PASSWORD');
        const rabbitmqUrl =
            `amqp://${rabbitmqUser}:${rabbitmqPassword}@` +
            `${rabbitmqHost}:${rabbitmqPort}`;

        return {
            transport: Transport.RMQ,
            options: {
                urls: [rabbitmqUrl],
                queue: queueName,
                queueOptions: {
                    durable: true,
                }
            }
        };
    }
}
