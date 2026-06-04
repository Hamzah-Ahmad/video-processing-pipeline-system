import { CurrentUser } from '@app/common/decorators';
import { CreateCommentDto } from '@app/common/dtos/comment/CreateComment.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from 'apps/user/src/entities/user.entity';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:mediaId')
  async createCommentOnVideo(
    @Body() { text }: CreateCommentDto,
    @CurrentUser() user: User,
    @Param('mediaId') mediaId,
  ) {
    return this.commentService.createCommentOnVideo({
      text,
      userId: user.id,
      mediaId,
    });
  }

  @Post('/:mediaId/:commentId')
  async addReplyToComment(
    @Body() { text }: CreateCommentDto,
    @CurrentUser() user: User,
    @Param() params: { mediaId: string; commentId: string },
  ) {
    return this.commentService.createCommentOnVideo({
      text,
      userId: user.id,
      mediaId: params.mediaId,
      parentId: params.commentId,
    });
  }

  @Get('/:mediaId')
  async getMediaComments(@Param('mediaId') mediaId) {
    return this.commentService.getMediaComments(mediaId);
  }
}
