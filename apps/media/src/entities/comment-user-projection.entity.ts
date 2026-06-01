import { Column, Entity, PrimaryColumn } from 'typeorm';


// Making use of 
@Entity('comment_user_projection')
export class CommentUserProjection {
  
  @PrimaryColumn()
  userId: string;

  @Column()
  name: string;

  @Column()
  username: string;

}

