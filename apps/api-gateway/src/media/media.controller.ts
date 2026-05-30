import { CurrentUser, Public } from '@app/common/decorators';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { UrlReqBodyDto } from './dto/UrlReqBody.dto';
import { UserDto } from '@app/common/dtos/user';
import { Request } from 'express';

@Controller('media')
export class MediaController {
  constructor(@Inject() private mediaService: MediaService) {}

  @Post('upload-url')
  async uploadUrl(@Body() body: UrlReqBodyDto, @CurrentUser() user: UserDto) {
    try {
      return await this.mediaService.uploadUrl(body, user.id);
    } catch (err: any) {
      // Service throws an RCP error which might not map well to HTTP. So throwing HTTP exception here
      throw new HttpException(
        err.message ?? 'Something went wrong',
        err.statusCode ?? 500,
      );
    }
  }

  // NOTE: For testing, delete.
  //  @Get('test')
  // test( @CurrentUser() user: UserDto, @Req() req: Request) {
  //   const cookie = req.cookies?.Authentication;
  //   return this.mediaService.test(cookie);
  // }
}
