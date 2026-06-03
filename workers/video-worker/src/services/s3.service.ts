import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export class S3Service {
  private readonly s3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: `http://localstack:4566`,
      forcePathStyle: true, // needed for LocalStack
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
  }

  async getS3Stream(bucket: string, key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const res = await this.s3Client.send(command);
      if (!res.Body) {
        throw new Error('Missing S3 body');
      }
      return res.Body as Readable; // Body returns the stream
    } catch (err) {
      console.error('S3 download failed', {
        bucket,
        key,
        error: err,
      });

      throw err;
    }
  }

  async upload(bucket: string, key: string, body: any) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
      });

      await this.s3Client.send(command);
    } catch (err) {
      console.log("Error while uploading...", err)
    }
  }
}

// const { contentType, filename } = payload;
//     const fileExtension = filename?.split('.').pop();

//     const key = `${filename.replace(/\s/g, '_')}-${Math.random()}.${fileExtension}`;

//     const command = new PutObjectCommand({
//       Bucket: this.BUCKET_NAME,
//       Key: key,
//       ContentType: contentType,
//     });
//     try {
//       const url = await getSignedUrl(this.s3Client, command, {
//         expiresIn: 900,
//       });
//       return url;
//     } catch (err) {
//       throw new RpcException({
//         statusCode: 500, // optional
//         message: 'Something went wrong',
//       });
//     }

// await s3Client.send(
//   new PutObjectCommand({
//     Bucket: 'processed-videos',
//     Key: outputKey,
//     Body: fileStreamOrBuffer,
//   }),
// );

export const s3Service = new S3Service();
