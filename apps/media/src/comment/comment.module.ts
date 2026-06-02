import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentUserProjection } from '../entities/comment-user-projection.entity';
import { DatabaseModule } from '../database/database.module';
import { Comment } from '../entities/comment.entity';

// CommentModule does not import DatabaseModule since it does not own the DB connection.
// It is imported into MediaModule which establishes the connection via DatabaseModule.
// This follows the same pattern as a monolith where only the root module (AppModule)
// calls forRootAsync, and feature modules only register their entities via forFeature.

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentUserProjection])],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService]
})
export class CommentModule {}
