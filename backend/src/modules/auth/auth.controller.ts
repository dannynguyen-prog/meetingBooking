import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CompleteSignupDto } from './dto/complete-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('complete-signup')
  completeSignup(@Body() dto: CompleteSignupDto) {
    return this.authService.completeSignup(dto);
  }
}

