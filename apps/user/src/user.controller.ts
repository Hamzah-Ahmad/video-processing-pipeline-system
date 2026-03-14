import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/common/constants';
import { GetUserDto } from '@app/common/dtos/user/GetUser.dto';
import { CreateUserDto } from '@app/common/dtos/user/CreateUser.dto';
import { VerifyUserDto } from '@app/common/dtos/user/VerifyUser.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.GET)
  getUser(@Payload() payload: GetUserDto) {
    return this.userService.getUser(payload.id);
  }

  @MessagePattern(USER_PATTERNS.CREATE)
  createUser(@Payload() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }

  @MessagePattern(USER_PATTERNS.VERIFY)
  verifyUser(@Payload() payload: VerifyUserDto) {
    return this.userService.verifyUser(payload);
  }
}
