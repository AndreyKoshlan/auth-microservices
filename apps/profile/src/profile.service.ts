import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { ProfileEntity } from './profile.entity';
import { ProfileRegistrationData } from './dto/register.dto';

@Injectable()
export class ProfileService {
  constructor(
      @InjectRepository(ProfileEntity)
      private readonly profileRepository: Repository<ProfileEntity>,
      @Inject('USER_SERVICE')
      private readonly userService: ClientProxy,
  ) {}

  async create(data: ProfileRegistrationData) {
    const userServiceData = { email: data.email, password: data.password };
    const userId = await firstValueFrom(
        this.userService.send('user_create',  userServiceData)
    );
    await this.profileRepository.save({...data, userId});
    return userId;
  }
}