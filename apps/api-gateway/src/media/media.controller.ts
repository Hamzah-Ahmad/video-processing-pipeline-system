import { CurrentUser, Public } from '@app/common/decorators';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { MediaService } from './media.service';
import { UrlReqBodyDto } from './dto/UrlReqBody.dto';
import { UserDto } from '@app/common/dtos/user';

@Controller('media')
export class MediaController {
  constructor(@Inject() private mediaService: MediaService) {}

  @Post('upload-url')
  uploadUrl(@Body() body: UrlReqBodyDto, @CurrentUser() user: UserDto) {
    return this.mediaService.uploadUrl(body);
  }
}
