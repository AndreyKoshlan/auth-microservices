import { Body, Controller, Post } from '@nestjs/common';
import { SessionLoginData } from './dto/login.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post()
  login(@Body() data: SessionLoginData) {
    return this.sessionService.login(data.email, data.password);
  }
}
