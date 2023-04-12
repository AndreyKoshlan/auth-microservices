import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    SharedModule,
    SharedModule.getTypeormModule('POSTGRES_USER_DB'),
    UserModule,
    SessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}
