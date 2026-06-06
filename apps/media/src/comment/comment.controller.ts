import { MEDIA_PATTERS } from '@app/common/constants';
import { CreateCommentInternalDto } from '@app/common/dtos/comment/CreateComment.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @MessagePattern(MEDIA_PATTERS.CREATE_COMMENT_ON_MEDIA)
  handleCreateCommentOnVideo(@Payload() payload: CreateCommentInternalDto) {
    return this.commentService.handleCreateCommentOnVideo(payload);
  }

  @MessagePattern(MEDIA_PATTERS.GET_MEDIA_COMMENTS)
  getMediaComments(@Payload() { mediaId }: { mediaId: string }) {
    return this.commentService.getMediaComments(mediaId);
  }

  @MessagePattern(MEDIA_PATTERS.GET_COMMENT_REPLIES)
  getCommentReplies(@Payload() { commentId }: { commentId: string }) {
    return this.commentService.getCommentReplies(commentId);
  }
}
