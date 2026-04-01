import { MEDIA_PATTERS, MEDIA_SERVICE, USER_PATTERNS } from '@app/common/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MediaService {
  constructor(@Inject(MEDIA_SERVICE) private mediaClient: ClientProxy) {}
  async getUploadUrl() {
     return await firstValueFrom(
          this.mediaClient.send<any, any>(MEDIA_PATTERS.GET_UPLOAD_URL, {}),
        );
  }
}
