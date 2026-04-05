import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, UserDto } from '@app/common/dtos/user';
import { firstValueFrom } from 'rxjs';
import { USER_PATTERNS, USER_SERVICE } from '@app/common/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { TokenPayload } from '@app/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
  ) {}

  async login(user: UserDto) {
    try {
      const tokenPayload: TokenPayload = {
        userId: user.id,
      };
      const expires = new Date();
      expires.setSeconds(
        expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
      );
      const accessToken = this.jwtService.sign(tokenPayload);
      return { accessToken, expires };
    } catch (error: any) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }

  async register(body: CreateUserDto) {
    try {
      const user = await firstValueFrom(
        this.userClient.send<any, CreateUserDto>(USER_PATTERNS.CREATE, body),
      );

      const { accessToken, expires } = await this.login(user);
      return { accessToken, expires, user };
    } catch (error: any) {
      // Pass error to the client with correct status
      if (error?.message === 'Username already taken') {
        throw new RpcException({
          statusCode: 409, // optional
          message: error.message,
        });
      }

      throw new RpcException({
        statusCode: 500, // optional
        message: 'User creation failed',
      });
    }
  }

  // Will be used when refresh token is implemented
  async logout() {
    return `Implement refresh token`;
  }
}
