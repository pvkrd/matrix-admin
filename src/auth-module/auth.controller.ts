import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth Guard')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly authService: AuthService,
  ) {}
}
