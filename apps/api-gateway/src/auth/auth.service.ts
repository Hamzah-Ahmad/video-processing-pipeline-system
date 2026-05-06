import { AUTH_PATTERNS, AUTH_SERVICE } from '@app/common/constants';
import { CreateUserDto } from '@app/common/dtos/user/CreateUser.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, EMPTY, firstValueFrom } from 'rxjs';
import { LoginDto } from './dtos/Login.dto';
import { Response } from 'express';
import { RegisterUserDto } from './dtos/Register.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  async login(body: LoginDto, response: Response): Promise<any> {
    const { accessToken, expires, user } = await firstValueFrom(
      this.authClient.send<any, LoginDto>(AUTH_PATTERNS.LOGIN, body),
    );

    return { accessToken, expires, user };
  }

  async register(body: RegisterUserDto, response: Response): Promise<any> {
    const { accessToken, expires, user } = await firstValueFrom(
      this.authClient.send<any, LoginDto>(AUTH_PATTERNS.REGISTER, body),
    );

    return { accessToken, expires, user };
  }

  async logout() {
    const data = await firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.LOGOUT, {}),
    );
  }
}
