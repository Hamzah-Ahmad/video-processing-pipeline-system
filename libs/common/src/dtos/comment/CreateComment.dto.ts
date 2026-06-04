import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;
}

export class CreateCommentInternalDto extends CreateCommentDto {
  @IsString()
  userId: string;

  @IsString()
  mediaId: string

  @IsOptional()
  @IsString()
  parentId?: string

}
