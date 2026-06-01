import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Media } from './media.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;
  
  @Column()
  text: string;

  @ManyToOne(() => Media, (media) => media.comments,  { onDelete: 'CASCADE' })
  media: Media
}




// Reference video for NOTE-01: https://www.youtube.com/watch?v=rKgZLVgdvAY&t=333s
// Asked the YT AI for more explanation. Added in dev_notes as "One To One Explicit Id" section