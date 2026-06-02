import { Controller, Get, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { MEDIA_PATTERS } from '@app/common/constants';
import { UrlReqInternalDto } from 'apps/api-gateway/src/media/dto/UrlReqBody.dto';
import { USER_TOPICS, VIDEO_TOPICS } from '@app/common/constants/kafka-topics';
import { TranscodeCompletedEvent } from '../interfaces/media.interface';
import { CommentUserDto } from '@app/common/dtos/user/CommentUser.dto';
import { CommentService } from '../comment/comment.service';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService, private readonly commentService: CommentService) {}

  // @UseGuards(JwtAuthGuard) // Using JwtAuthGuard here so that @CurrentUser works because we need user info. Will require us to send auth from the producer of GET_UPLOAD_URL as well. More details in dev_notes
  @MessagePattern(MEDIA_PATTERS.GET_UPLOAD_URL)
  uploadUrl(@Payload() payload: UrlReqInternalDto): Promise<string> {
    return this.mediaService.uploadUrl(payload);
  }

  // Cant use JWTAuthGuard as this event is emitted by a worker that does not have access to user
  @MessagePattern(VIDEO_TOPICS.PROCESSED) // TODO - Change this MessagePattern to EventPattern instead since htis is consuming a Kafka event and the producer is not expecting a response. Do it when codebase clean so it can be properly testd.
  saveUrlsToDb(@Payload() payload: TranscodeCompletedEvent): any {
    console.log('LOGGER - user: ', { payload, outputF: payload.outputs?.[0] });

    return this.mediaService.saveUrlsToDb(payload);
  }

  @EventPattern(USER_TOPICS.CREATED) 
  handleUserCreated(@Payload() payload: CommentUserDto): any {
    this.commentService.createCommentUser(payload);
  }

  // NOTE: For testing, delete.
  // @UseGuards(JwtAuthGuard)
  // @MessagePattern('media_test')
  // test(@Payload() payload: any, @CurrentUser() user: UserDto): any {
  //   return {message: `REACHED MEDIA TEST`, payload, user};
  // }
}
