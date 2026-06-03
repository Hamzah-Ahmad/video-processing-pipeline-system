import { MEDIA_PATTERS } from '@app/common/constants';
import { CreateCommentInternalDto } from '@app/common/dtos/comment/CreateComment.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @MessagePattern(MEDIA_PATTERS.CREATE_COMMENT_ON_MEDIA) // TODO - Change this MessagePattern to EventPattern instead since htis is consuming a Kafka event and the producer is not expecting a response. Do it when codebase clean so it can be properly testd.
  saveUrlsToDb(@Payload() payload: CreateCommentInternalDto): any {
    return this.commentService.handleCreateCommentOnVideo(payload);
  }
}
