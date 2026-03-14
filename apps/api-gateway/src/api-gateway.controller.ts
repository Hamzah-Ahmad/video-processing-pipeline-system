import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller()
export class ApiGatewayController {
  @Public()
  @Get('/')
  async getHealth() {
    return `API gateway running`;
  }

  @Get('/adminOnly')
  @Roles(Role.Admin)
  getAdminOnly(): string {
    return `Admin route`;
  }

  @Get('/admin_user')
  @Roles(Role.Admin, Role.User)
  getAdminAndUser(): string {
    return `Admin & User route`;
  }

  // Note: Only for testing purposes. Remove
  // @UseGuards(JwtAuthGuard) // NOTE: No need for individual guards on protected route as we are globally applying the JwtAuthGuard as an application-wide guard using the APP_GUARD token  in the module provders
  @Get('/protected')
  async getProtected() {
    return `Protected route`;
  }
}
