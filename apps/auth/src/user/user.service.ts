import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      private readonly configService: ConfigService
  ) {}

  async create(email: string, password: string) {
    const salt = +this.configService.get<string>('POSTGRES_SALT');
    const passwordHash = await bcrypt.hash(password, salt);
    return this.userRepository.save({ email, passwordHash });
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {email}
    });
    if (!user)
      throw new NotFoundException();
    return user;
  }
}
