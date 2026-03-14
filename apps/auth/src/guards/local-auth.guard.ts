// import { AuthGuard } from '@nestjs/passport';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { LocalStrategy } from '../strategies/local.strategy';
import { RpcException } from '@nestjs/microservices';

// export class LocalAuthGuard extends AuthGuard('local') {} // Would be sufficient for monorepos

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private localStrategy: LocalStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();

    try {
      // Manually call the strategy's validate method
      const user = await this.localStrategy.validate(
        data.username,
        data.password,
      );

      // Attach the user to the data so @CurrentUser() can access it
      data.user = user;

      return true;
    } catch (err) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED, // optional
        message: err.message,
      });
    }
  }
}
