import { CreateUserDto } from '@app/common/dtos/user/CreateUser.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  createUser(@Body() body: CreateUserDto) {
    const response = this.userService.createUser(body);
    return response;
  }
}
