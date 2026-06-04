import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Media } from './media.entity';
import { CommentUserProjection } from './comment-user-projection.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column()
  text: string;

  @ManyToOne(() => Media, (media) => media.comments, { onDelete: 'CASCADE' })
  media: Media;

  // @ManyToOne - many comments can belong to one user projection
  // @JoinColumn connects the two tables:
  //   - name: 'userId' tells TypeORM to use the existing userId column on the comments table as the join key
  //     (without this, TypeORM would auto-generate a new 'authorId' column based on the property name)
  //   - referencedColumnName: 'userId' tells TypeORM to match against the userId column on the comment_user_projection table
  //     (without this, TypeORM defaults to matching against the 'id' column on comment_user_projection)
  // createForeignKeyConstraints: false disables the strict DB-level foreign key check, since the projection
  //   is populated asynchronously via events and a userId on a comment may not yet exist in comment_user_projection
  @ManyToOne(() => CommentUserProjection, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  author: CommentUserProjection;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  parent: Comment;

  @Column({ nullable: true })
  parentId: string;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  replyCount: string; // Needed for loadRelationAndCount
}
