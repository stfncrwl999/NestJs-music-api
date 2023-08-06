import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role, User } from '@prisma/client';
import { CreateSignupDto } from './dto/create-signup-dto';
import { Response } from 'express';
import { CreateProductKeyDto } from './dto/create-product-key-dto';
import { CreateLoginDto } from './dto/create-login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('product-key')
  async generateProductKey(
    @Body() productKeyData: CreateProductKeyDto,
  ): Promise<string> {
    return this.authService.generateProductKey(productKeyData);
  }

  @Post('signup/:role')
  async signup(
    @Res() response: Response,
    @Param('role', new ParseEnumPipe(Role)) role: Role,
    @Body() signupData: CreateSignupDto,
  ): Promise<User> {
    return this.authService.signup(response, role, signupData);
  }

  @Post('confirm/:token')
  async confirmEmail(@Param('token') token: string): Promise<User> {
    return this.authService.confirmEmail(token);
  }

  @Post('login')
  async login(
    @Res() response: Response,
    @Body() loginData: CreateLoginDto,
  ): Promise<User> {
    return this.authService.login(response, loginData);
  }
}
