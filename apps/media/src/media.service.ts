import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UrlReqBodyDto,
  UrlReqInternalDto,
} from 'apps/api-gateway/src/media/dto/UrlReqBody.dto';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Media, MediaStatus, VideoRendition } from './entities/media.entity';
import { TranscodeCompletedEvent } from './interfaces/media.interface';

@Injectable()
export class MediaService {
  private s3Client: S3Client;
  private BUCKET_NAME = 'uploaded-videos';

  private readonly logger = new Logger(MediaService.name); // ✅ class property

  // Why localhost:4566 instead of localstack:4566?
  //
  // This service runs inside Docker, so you might expect us to use the internal
  // Docker DNS name "localstack" to reach LocalStack — and we do (video worker, for example).
  //
  // However, this code doesn't call LocalStack directly. It generates a presigned URL
  // and returns it to the client (the browser). The browser then uses that URL to
  // upload directly to LocalStack. The browser is NOT inside Docker, so it has no
  // idea what "localstack" means as a hostname — it would fail to resolve it.
  //
  // The browser can only reach LocalStack via the host machine's port mapping
  // (localhost:4566 → localstack container port 4566), so the presigned URL
  // must contain localhost:4566, not localstack:4566.
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: `http://localhost:4566`, // read comment above
      forcePathStyle: true, // needed for LocalStack
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
  }

  async uploadUrl(payload: UrlReqInternalDto): Promise<string> {
    const { contentType, filename, userId } = payload;
    const fileExtension = filename?.split('.').pop();
    const mediaId = crypto.randomUUID();
    const key = `videos/${mediaId}/raw.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    let url: string;
    try {
      url = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
    } catch (err) {
      console.error('Failed to generate signed URL:', err);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to generate upload URL',
      });
    }

    try {
      const newMedia = this.mediaRepository.create({
        id: mediaId,
        userId,
        status: MediaStatus.PROCESSING,
        originalBucket: this.BUCKET_NAME,
        originalKey: key,
      });
      await this.mediaRepository.save(newMedia);
    } catch (err) {
      console.error('Failed to save media record:', err);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to create media record',
      });
    }

    return url;
  }
  async saveUrlsToDb(payload: TranscodeCompletedEvent): Promise<any> {
    let media: Media | null;

    const mediaId = payload?.inputKey?.split('/')?.[1];
    if (!mediaId) {
      this.logger.error(
        `Media not found for ${payload.inputBucket}/${payload.inputKey}`,
      );
      throw new RpcException({
        statusCode: 404,
        message: `Media not found for ${payload.inputBucket}/${payload.inputKey}`,
      });
    }

    try {
      media = await this.mediaRepository.findOne({ where: { id: mediaId } });
      if (!media) {
        this.logger.error(
          `Media not found for ${payload.inputBucket}/${payload.inputKey}`,
        );
        throw new RpcException({
          statusCode: 404,
          message: `Media not found for ${payload.inputBucket}/${payload.inputKey}`,
        });
      }
    } catch (err) {
      if (err instanceof RpcException) throw err; // this is just so that we throw the exceptuon we wrote in the try block above

      throw new RpcException({
        statusCode: 500,
        message: `Something went wrong`,
      });
    }

    try {
      const renditions: VideoRendition[] = payload.outputs.map((output) => ({
        resolution: output.quality,
        bucket: output.bucket,
        key: output.key,
      }));
      media.renditions = renditions;
      media.status = MediaStatus.READY;
      await this.mediaRepository.save(media);
    } catch (err) {
      try {
        media.status = MediaStatus.FAILED;
        await this.mediaRepository.save(media);
      } catch {
        this.logger.error(`Failed to mark media ${media.id} as failed`);
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Something went wrong',
      });
    }
  }
}
