import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern } from '@nestjs/microservices';
import { MEDIA_PATTERS } from '@app/common/constants';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern( MEDIA_PATTERS.GET_UPLOAD_URL)
  getUploadUrl(): string {
    return `Media Microservice Online`
  }
}
