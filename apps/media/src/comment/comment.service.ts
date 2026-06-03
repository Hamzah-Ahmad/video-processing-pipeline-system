import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentUserProjection } from '../entities/comment-user-projection.entity';
import { Repository } from 'typeorm';
import { CommentUserDto } from '@app/common/dtos/user/CommentUser.dto';
import { CreateCommentInternalDto } from '@app/common/dtos/comment/CreateComment.dto';
import { RpcException } from '@nestjs/microservices';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @InjectRepository(CommentUserProjection)
    private readonly commentUserRepository: Repository<CommentUserProjection>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createCommentUser(body: CommentUserDto) {
    try {
      const user = this.commentUserRepository.create(body);

      await this.commentUserRepository.save(user);
    } catch (err: any) {
      this.logger.error('Failed to create CommentUserProjection', err.stack);

      /**
       * IMPORTANT (Claude explanation):
       * We rethrow here so the Kafka consumer is aware that processing failed.
       *
       * CURRENT STATE (autoCommit: true):
       * - Kafka does NOT reliably wait for this failure before committing offsets.
       * - This means rethrowing is mainly for observability (logs, metrics),
       *   NOT for guaranteed retries.
       *
       * FUTURE IMPROVEMENT (autoCommit: false):
       * - When autoCommit is disabled, throwing here will prevent offset commit.
       * - That means Kafka will NOT mark the message as successfully processed.
       * - The message will then be retried (or sent to retry/DLQ depending on config).
       *
       * WHY THIS MATTERS:
       * - With autoCommit: true → you can silently lose messages even if you throw.
       * - With autoCommit: false → throw becomes the signal that triggers retry behavior.
       */
      throw err;
    }
  }

  async handleCreateCommentOnVideo(body: CreateCommentInternalDto) {
    try {
      const newComment = this.commentRepository.create({
        text: body.text,
        userId: body.userId,
        media: {
          id: body.mediaId, // If we had created an explicit mediaId property in the comment table (@Column()mediaId: string;), we could have used mediaId: body.mediaId. that is the pattern briefly mentioned in dev_notes section "One To One Explicit Id"
        },
      });

      return await this.commentRepository.save(newComment);
    } catch (err: any) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || `Error occurred while creating comment`,
      });
    }
  }

  async getMediaComments(mediaId: string) {
    try {
      const comments = await this.commentRepository.find({
        where: {
          media: {
            id: mediaId,
          },
        },
        relations: {
          author: true
        }
      });
      return comments;
    } catch (err: any) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || `Error occurred while creating comment`,
      });
    }
  }
}
