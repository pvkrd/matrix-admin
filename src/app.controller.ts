import { Controller, Get, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiTags('health')
@ApiBearerAuth('Authorization') //edit here
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  health(@Headers('Ocp-Apim-Subscription-Key') _: string) {
    return { message: 'Service seems to up.' };
  }
}
