import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import processVideo from './jobs/process-video';
import { Kafka } from 'kafkajs';

const sqs = new SQSClient({
  region: 'us-east-1',
  endpoint: 'http://localstack:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});

export const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: `http://localstack:4566`,
  forcePathStyle: true, // needed for LocalStack
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

const kafka = new Kafka({
  clientId: 'video-worker',
  brokers: ['kafka:9092'],
});

export const producer = kafka.producer();

async function pollQueue() {
  //   while (true) {
  //     try {
  //       const result = await sqs.send(
  //         new ReceiveMessageCommand({
  //           QueueUrl: "http://localstack:4566/000000000000/video-processing",
  //           WaitTimeSeconds: 20
  //         })
  //       );

  //       if (result.Messages?.length) {
  //         console.log("Received message:", result.Messages[0].Body);
  //       }
  //     } catch (err) {
  //       console.error("Worker error:", err);
  //     }
  //   }

  while (true) {
    try {
      const result = await sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: 'http://localstack:4566/000000000000/UploadVideoQueue', // 'http://localstack:4566/000000000000/video-processing',
          WaitTimeSeconds: 20,
          MaxNumberOfMessages: 1,
        }),
      );

      if (result.Messages?.length) {
        const messages = result.Messages;
        for (const message of messages) {
          try {
            const body = JSON.parse(message.Body || '');

            for (const record of body?.Records) {
              const bucket = record.s3.bucket.name;
              const key = record.s3.object.key;

              await processVideo({ inputBucket: bucket, inputKey: key });
            }

            await sqs.send(
              new DeleteMessageCommand({
                QueueUrl: 'http://localstack:4566/000000000000/UploadVideoQueue',
                ReceiptHandle: message.ReceiptHandle,
              }),
            );
          } catch (err) {
            console.error(
              'Failed to process message, leaving in queue for retry:',
              err,
            );
          }
        }
      }
    } catch (err) {
      console.error('Worker error:', err);
    }
  }
}

async function bootstrap() {
  try {
    console.log('Connecting Kafka producer...');
    await producer.connect();
    console.log('Kafka producer connected');

    await pollQueue();
  } catch (err) {
    console.error('Bootstrap error:', err);
    process.exit(1);
  }
}

async function shutdown() {
  try {
    console.log('Shutting down worker...');
    await producer.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Shutdown error:', err);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

bootstrap();
