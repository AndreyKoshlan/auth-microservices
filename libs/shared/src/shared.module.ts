import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedService } from './shared.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static getRmqModule(name_env: string, queueName_env: string): DynamicModule {
    console.log('====================' + ' ' + process.env[name_env] + ' ' + name_env);
    return ClientsModule.registerAsync([{
      name: process.env[name_env],
      imports: [ConfigModule, SharedModule],
      useFactory: (configService: ConfigService, sharedService: SharedService) => (
          (() => {
            const queueName = configService.get(queueName_env);
            return sharedService.getRmqOptions(queueName);
          })()
      ),
      inject: [ConfigService, SharedService],
    }]);
  }

  static getTypeormModule(dbName_env: string): DynamicModule {
    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get(dbName_env),
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    });
  }
}
