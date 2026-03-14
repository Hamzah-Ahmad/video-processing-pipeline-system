// import { Exclude } from 'class-transformer';
// import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// export enum Role {
//   User = 'user',
//   Moderator = 'moderator',
//   Admin = 'admin',
// }

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ nullable: true })
//   name: string;

//   @Column({ unique: true })
//   username: string;

//   @Column()
//   @Exclude()
//   password: string;

//   @Column({ nullable: true })
//   @Exclude()
//   refreshToken: string;

//   @Column({
//     type: 'enum',
//     enum: Role,
//     default: Role.User,
//   })
//   role: Role;
// }

import { Role } from '@app/common/enums';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(Role)
  role: Role;
}
