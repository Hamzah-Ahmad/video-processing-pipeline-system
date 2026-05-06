import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UrlReqBodyDto } from 'apps/api-gateway/src/media/dto/UrlReqBody.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  private s3Client: S3Client;
  private BUCKET_NAME = 'uploaded-videos';

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
  constructor() {
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

  async uploadUrl(payload: UrlReqBodyDto): Promise<string> {
    const { contentType, filename } = payload;
    const fileExtension = filename?.split('.').pop();

    // const key = `${filename.replace(/\s/g, '_')}-${Math.random()}.${fileExtension}`;
    const baseId = crypto.randomUUID();
    const key = `videos/${baseId}/raw.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 900,
      });
      return url;
    } catch (err) {
      console.log(err);
      throw new RpcException({
        statusCode: 500, // optional
        message: 'Something went wrong',
      });
    }
  }
}
