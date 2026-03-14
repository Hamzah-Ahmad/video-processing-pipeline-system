import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { map, Observable, tap, catchError, of } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserDto } from '../dtos/user';
import { AUTH_PATTERNS } from '../constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';

/**
 * Universal JWT Auth Guard (HTTP + RPC)
 *
 * Supports:
 *   - HTTP controllers (API Gateway)
 *   - RPC microservice handlers (TCP, RabbitMQ, etc.)
 *
 * How it works:
 *   1. Detects the context type using ExecutionContext.getType()
 *      - 'http' → handled by handleHttp()
 *      - 'rpc'  → handled by handleRpc()
 *
 *   2. Extracts JWT from:
 *      - HTTP: request.cookies.Authentication
 *      - RPC:  payload.Authentication
 *
 *   3. Validates token by calling the Auth microservice.
 *
 *   4. On success:
 *      - HTTP: attaches user to request.user
 *      - RPC:  attaches user to data.user
 *
 *   5. On failure:
 *      - HTTP: returns `of(false)` → request blocked
 *      - RPC: throws RpcException → microservice error flow
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if route/class is decorated with @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // Determine the request type: 'http', 'rpc', or 'ws'
    const type = context.getType();

    if (type === 'http') {
      return this.handleHttp(context);
    }

    if (type === 'rpc') {
      return this.handleRpc(context);
    }

    // Other transports not supported
    return false;
  }

  /**
   * Handle HTTP requests (e.g. API Gateway)
   */
  private handleHttp(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // JWT stored in HttpOnly cookie
    const jwt = request.cookies?.Authentication;

    if (!jwt) {
      // No token → deny request
      return of(false);
    }

    // Validate JWT via Auth microservice
    return this.authClient
      .send<UserDto>(AUTH_PATTERNS.AUTHENTICATE, { Authentication: jwt })
      .pipe(
        // If token is valid → attach user to request object
        tap((user) => {
          request.user = user;
        }),

        // Allow request
        map(() => true),

        // If validation fails → deny request (return false)
        catchError(() => of(false)),
      );
  }

  /**
   * Handle RPC/TCP messages from microservices
   */
  private handleRpc(context: ExecutionContext): Observable<boolean> {
    const data = context.switchToRpc().getData();

    // RPC messages do not have cookies → JWT must be inside payload
    const jwt = data?.Authentication;

    if (!jwt) {
      throw new RpcException('No JWT provided');
    }

    // Validate JWT via Auth microservice
    return this.authClient
      .send<UserDto>(AUTH_PATTERNS.AUTHENTICATE, { Authentication: jwt })
      .pipe(
        // Attach user to payload for microservice handler
        tap((user) => {
          data.user = user;
        }),

        // Allow message handler
        map(() => true),

        // If errors → throw RPC exception (standard for microservices)
        catchError(() => {
          throw new RpcException('Invalid token');
        }),
      );
  }
}
