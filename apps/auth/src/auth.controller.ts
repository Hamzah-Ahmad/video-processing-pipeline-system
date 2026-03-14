import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@app/common/decorators';
import { CreateUserDto, UserDto } from '@app/common/dtos/user';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AUTH_PATTERNS } from '@app/common/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(@CurrentUser() user: UserDto) {
    const { accessToken, expires } = await this.authService.login(user);
    return { accessToken, expires, user };
  }

  // @Post('register')
  @MessagePattern(AUTH_PATTERNS.REGISTER)
  async register(@Body() body: CreateUserDto) {
    const { accessToken, user, expires } =
      await this.authService.register(body);
    return { accessToken, expires, user };
  }

  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  async logout() {
    return await this.authService.logout();
  }

  // Using guard here will ensure that the JWT received in the request will be checked verified.
  // The JWTAuthGuard will add the user property to the Payload, similar to how it adds to the request object
  // Details here: https://claude.ai/share/15c322ed-93c3-4155-852d-550a766e6689
  @UseGuards(JwtAuthGuard)
  @MessagePattern(AUTH_PATTERNS.AUTHENTICATE)
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
