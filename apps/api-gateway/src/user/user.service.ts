import { USER_PATTERNS, USER_SERVICE } from '@app/common/constants';
import { CreateUserDto } from '@app/common/dtos/user/CreateUser.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject(USER_SERVICE) private userClient: ClientProxy) {}

  async createUser(body: CreateUserDto) {
    return await firstValueFrom(
      this.userClient.send<any, CreateUserDto>(USER_PATTERNS.CREATE, body),
    );
  }
}
