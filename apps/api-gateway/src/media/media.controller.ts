import { Public } from '@app/common/decorators';
import { Controller, Get, Inject } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(@Inject() private mediaService: MediaService) {}
  @Public()
  @Get('upload')
  getUploadUrl() {
    return  this.mediaService.getUploadUrl()
  }
}
