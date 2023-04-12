import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedService } from './shared.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

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
    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule, SharedService],
      useFactory: (configService: ConfigService, sharedService: SharedService) => (
          (() => {
            const queueName = configService.get(queueName_env);
            const options = sharedService.getRmqOptions(queueName);
            return { ...options, name: configService.get(name_env) };
          })()
      ),
      inject: [ConfigService, SharedService],
    });
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
