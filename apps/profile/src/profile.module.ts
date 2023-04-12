import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@app/shared';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileEntity } from './profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    SharedModule,
    SharedModule.getRmqModule('RABBITMQ_AUTH_CONNECTION', 'RABBITMQ_AUTH_QUEUE'),
    SharedModule.getTypeormModule('POSTGRES_PROFILE_DB'),
    TypeOrmModule.forFeature([
        ProfileEntity
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
