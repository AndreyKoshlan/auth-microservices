import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: '24h'
      }
    }),
  ],
  controllers: [SessionController],
  providers: [SessionService, UserService],
  exports: [SessionService]
})
export class SessionModule {}
