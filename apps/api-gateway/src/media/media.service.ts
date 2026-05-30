import {
  MEDIA_PATTERS,
  MEDIA_SERVICE,
  USER_PATTERNS,
} from '@app/common/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UrlReqBodyDto, UrlReqInternalDto } from './dto/UrlReqBody.dto';

@Injectable()
export class MediaService {
  constructor(@Inject(MEDIA_SERVICE) private mediaClient: ClientProxy) {}
  async uploadUrl({ filename, contentType }: UrlReqBodyDto, userId: string) {
    return await firstValueFrom(
      this.mediaClient.send<any, UrlReqInternalDto>(
        MEDIA_PATTERS.GET_UPLOAD_URL,
        {
          filename,
          contentType,
          userId,
        },
      ),
    );
  }

  // NOTE: For testing, delete.
  // async test(authCookie: string) {
  //   return await firstValueFrom(
  //     this.mediaClient.send<any, any>('media_test', {
  //       Authentication: authCookie
  //     }),
  //   );
  // }
}
