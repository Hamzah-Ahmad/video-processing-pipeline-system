import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;
}

export class CreateCommentInternalDto extends CreateCommentDto {
  userId: string;
  mediaId: string
}
