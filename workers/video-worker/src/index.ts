import { ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
const sqs = new SQSClient({
  region: 'us-east-1',
  endpoint: 'http://localstack:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});

async function pollQueue() {
  console.log('LOGGER - pollQuueu running...');
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
        }),
      );

      if (result.Messages?.length) {
        const messages = result.Messages;
        for (const message of messages) {
            console.log("NOWLOG2 - message: ", message)
        }
      }
    } catch (err) {
      console.error('Worker error:', err);
    }
  }
}

pollQueue();
