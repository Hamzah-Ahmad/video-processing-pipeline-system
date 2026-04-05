import { Public } from '@app/common/decorators';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { MediaService } from './media.service';
import { UrlReqBodyDto } from './dto/UrlReqBody.dto';

@Controller('media')
export class MediaController {
  constructor(@Inject() private mediaService: MediaService) {}
  @Public()
  @Post('upload-url')
  uploadUrl(@Body() body: UrlReqBodyDto) {
    return this.mediaService.uploadUrl(body);
  }
}
