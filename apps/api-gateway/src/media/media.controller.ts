import { CurrentUser, Public } from '@app/common/decorators';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { UrlReqBodyDto } from './dto/UrlReqBody.dto';
import { UserDto } from '@app/common/dtos/user';
import { Request } from 'express';
import { GetMediaDto } from '@app/common/dtos/media/GetMedia.dto';

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

  @Get('/')
  async getAllVideos(@Query() query: GetMediaDto) {
    try {
      return await this.mediaService.getAllMedia(query)
    } catch (err: any) {
      throw new HttpException(
        err.message ?? 'Something went wrong',
        err.statusCode ?? 500,
      );
    }
  }
}
