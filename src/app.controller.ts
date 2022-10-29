import { Controller, Get } from '@nestjs/common';
import { DEFAULT_API_WELCOME_MESSAGE } from './config/config';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return DEFAULT_API_WELCOME_MESSAGE;
  }
}
