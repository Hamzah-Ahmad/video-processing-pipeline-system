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

  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: `http://localhost:4566`,
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

    const key = `${filename.replace(/\s/g, '_')}-${Math.random()}.${fileExtension}`;

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
      console.log('LOGGER - err: ', err);
      throw new RpcException({
        statusCode: 500, // optional
        message: 'Something went wrong',
      });
    }
  }
}
