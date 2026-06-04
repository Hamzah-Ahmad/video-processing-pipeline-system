import { MEDIA_PATTERS, MEDIA_SERVICE } from '@app/common/constants';
import { CreateCommentInternalDto } from '@app/common/dtos/comment/CreateComment.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommentService {
  constructor(@Inject(MEDIA_SERVICE) private mediaClient: ClientProxy) {}

  async createCommentOnVideo({
    text,
    userId,
    mediaId,
    parentId
  }: {
    text: string;
    userId: string;
    mediaId: string;
    parentId?: string;
  }) {
    return await firstValueFrom(
      this.mediaClient.send<any, CreateCommentInternalDto>(
        MEDIA_PATTERS.CREATE_COMMENT_ON_MEDIA,
        {
          text,
          userId,
          mediaId,
          parentId
        },
      ),
    );
  }

  async getMediaComments(mediaId: string) {
    return await firstValueFrom(
      this.mediaClient.send<any, { mediaId: string }>(
        MEDIA_PATTERS.GET_MEDIA_COMMENTS,
        {
          mediaId,
        },
      ),
    );
  }
}
