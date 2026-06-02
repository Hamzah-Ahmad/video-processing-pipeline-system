import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentUserProjection } from '../entities/comment-user-projection.entity';
import { Repository } from 'typeorm';
import { CommentUserDto } from '@app/common/dtos/user/CommentUser.dto';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @InjectRepository(CommentUserProjection)
    private readonly commentUser: Repository<CommentUserProjection>,
  ) {}

  async createCommentUser(body: CommentUserDto) {
    try {
      const user = this.commentUser.create(body);

      await this.commentUser.save(user);
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
}
