import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MEDIA_PATTERS } from '@app/common/constants';
import { UrlReqBodyDto } from 'apps/api-gateway/src/media/dto/UrlReqBody.dto';
import { VIDEO_TOPICS } from '@app/common/constants/kafka-topics';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(MEDIA_PATTERS.GET_UPLOAD_URL)
  uploadUrl(@Payload() payload: UrlReqBodyDto): Promise<string> {
    return this.mediaService.uploadUrl(payload);
  }

  @MessagePattern(VIDEO_TOPICS.PROCESSED)
  saveUrlsToDb(@Payload() payload: any): any {
    console.log('LOGGER - payload: ', payload);
    return `REACHED`;
  }
}
