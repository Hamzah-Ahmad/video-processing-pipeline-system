import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum MediaStatus {
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
}

export type VideoRendition = {
  resolution: string;   // "720p"
  width?: number;
  height?: number;
  bitrate?: number;

  bucket: string;
  key: string;
};

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column({ default: 'Untitled' })
  title: string;

  @Column({ nullable: true })
  description: string;

  // ORIGINAL UPLOAD (S3 identity, not URL)
  @Column()
  originalBucket: string;

  @Column()
  originalKey: string;

  // TRANSCODED OUTPUTS
  @Column({ type: 'jsonb', nullable: true })
  renditions: VideoRendition[];

  @Column({
    type: 'enum',
    enum: MediaStatus,
    default: MediaStatus.PROCESSING,
  })
  status: MediaStatus;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}