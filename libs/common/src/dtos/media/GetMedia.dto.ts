import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetMediaDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsUUID()
  authorId: string
}
