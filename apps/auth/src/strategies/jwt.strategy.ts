import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { USER_PATTERNS, USER_SERVICE } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetUserDto } from '@app/common/dtos/user';
import { TokenPayload } from '@app/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // (request: Request) => request?.cookies?.Authentication, //TODO: Remove comment. This implementation is sufficient for monoliths. We need to make updates for microservices

        (request: any) =>
          request?.cookies?.Authentication || request?.Authentication,
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  // NOTE: Remove comment
  // userId is available here because after the jwt token is decoded, the payload used when creating the token is going to be supplied here. Check auth service login method to see where userId is coming from
  // The token is decoded before reaching here. Flow mentioned at the bottom of the file
  async validate({ userId }: TokenPayload) {
    // NOTE: Remove comment
    // Whatever we return from the validate method, gets populated on the request object. That is the reason the CurrentUser decorators work

    const response = await firstValueFrom(
      this.userClient.send<any, GetUserDto>(USER_PATTERNS.GET, { id: userId }),
    );

    return response;
  }
}

// NOTE: Remove comment
// Flow of Execution
// Client Sends Request with JWT

// The request includes a JWT in the Authorization: Bearer <token> header or another specified location.
// Passport Middleware Extracts the Token

// The passport-jwt strategy extracts the token based on the JwtStrategy configuration (e.g., from headers or cookies).
// JWT is Verified

// passport-jwt uses the secretOrKey (or public key for RS256) to verify the token's validity.
// If verification fails (invalid signature, expired token, etc.), the request is rejected.
// validate Method Runs

// If the token is valid, NestJS calls the validate method, passing the decoded payload (without verifying business logic).
// This is where you can perform additional checks (e.g., fetch user from DB, check role/permissions, etc.).
// User is Attached to req.user

// The return value of validate is assigned to req.user, making it accessible in request handlers.
