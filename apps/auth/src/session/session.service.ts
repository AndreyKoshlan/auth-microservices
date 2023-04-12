import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class SessionService {
  constructor(
      private jwtService: JwtService,
      private userService: UserService
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    await this.validatePassword(user, password);
    return this.generateToken(user);
  }

  async validatePassword(user: UserEntity, password: string) {
    const passwordEquals = await bcrypt.compare(password, user.passwordHash);
    if (!passwordEquals)
      throw new UnauthorizedException();
    return true;
  }

  async generateToken(user: UserEntity) {
    return {
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role
      })
    }
  }
}
