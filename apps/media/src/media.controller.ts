import { Controller, Get, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { MEDIA_PATTERS } from '@app/common/constants';
import { UrlReqBodyDto, UrlReqInternalDto } from 'apps/api-gateway/src/media/dto/UrlReqBody.dto';
import { VIDEO_TOPICS } from '@app/common/constants/kafka-topics';
import { JwtAuthGuard } from '@app/common/guards';
import { CurrentUser } from '@app/common/decorators';
import { UserDto } from '@app/common/dtos/user';
import { TranscodeCompletedEvent } from './interfaces/media.interface';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // @UseGuards(JwtAuthGuard) // Using JwtAuthGuard here so that @CurrentUser works because we need user info. Will require us to send auth from the producer of GET_UPLOAD_URL as well. More details in dev_notes
  @MessagePattern(MEDIA_PATTERS.GET_UPLOAD_URL)
  uploadUrl(@Payload() payload: UrlReqInternalDto): Promise<string> {
    return this.mediaService.uploadUrl(payload);
  }

  // Cant use JWTAuthGuard as this event is emitted by a worker that does not have access to user
  @MessagePattern(VIDEO_TOPICS.PROCESSED)
  saveUrlsToDb(@Payload() payload: TranscodeCompletedEvent): any {
    console.log('LOGGER - user: ', { payload, outputF: payload.outputs?.[0]  });

    return this.mediaService.saveUrlsToDb(payload)
  }

  // NOTE: For testing, delete.
  // @UseGuards(JwtAuthGuard)
  // @MessagePattern('media_test')
  // test(@Payload() payload: any, @CurrentUser() user: UserDto): any {
  //   return {message: `REACHED MEDIA TEST`, payload, user};
  // }
}
