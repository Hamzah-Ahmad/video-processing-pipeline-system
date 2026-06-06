import { IsString } from 'class-validator';

export class UrlReqBodyDto {
  @IsString()
  filename: string;

  @IsString()
  contentType: string;

  @IsString()
  title: string;
}

export class UrlReqInternalDto extends UrlReqBodyDto {
  userId: string;
}
