import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { USER_PATTERNS, USER_SERVICE } from '@app/common/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserDto, VerifyUserDto } from '@app/common/dtos/user';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(USER_SERVICE) private userClient: ClientProxy) {
    super({
      //   usernameField: 'email',
    });
  }

  async validate(username: string, password: string) {
    // TODO: Remove comment
    // Whatever we return from the validate method, gets populated on the request object. That is the reason the CurrentUser decorators work
    try {
      const response = await firstValueFrom(
        this.userClient.send<UserDto, VerifyUserDto>(USER_PATTERNS.VERIFY, {
          username,
          password,
        }),
      );

      return response;
    } catch (err) {
      // The alidateUser in userService makes use of AbstractCrudService to find the existing user.
      throw new RpcException(err);
    }
  }
}
