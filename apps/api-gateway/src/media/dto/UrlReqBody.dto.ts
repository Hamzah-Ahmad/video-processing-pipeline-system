import { IsString } from 'class-validator';

export class UrlReqBodyDto {
  @IsString()
  filename: string;

  @IsString()
  contentType: string;
}
