import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/Login.dto';
import { Response } from 'express';
import { Public } from '@app/common/decorators';
import { RegisterUserDto } from './dtos/Register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, expires, user } = await this.authService.login(
      body,
      response,
    );

    const expiresDate = new Date(expires);
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      expires: expiresDate,
    });
    response.status(200).send(user);
  }

  @Public()
  @Post('register')
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, expires, user } = await this.authService.register(
      body,
      response,
    );

    const expiresDate = new Date(expires);
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      expires: expiresDate,
    });
    response.status(200).send(user);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // await this.authService.logout();  // Will be used when refresh token is implemented
    response.clearCookie('Authentication');
    response.status(200).send();
  }
}
