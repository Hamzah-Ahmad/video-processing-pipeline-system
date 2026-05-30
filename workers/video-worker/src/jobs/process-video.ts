import { Upload } from '@aws-sdk/lib-storage';
import { spawn } from 'child_process';
import crypto from 'crypto';

import { s3Service } from '../services/s3.service';
import { s3, producer } from '..';

const formats = [
  {
    name: '360p',
    scale: '640:360',
  },
  {
    name: '720p',
    scale: '1280:720',
  },
  {
    name: '1080p',
    scale: '1920:1080',
  },
];

export default async function processVideo({
  inputBucket,
  inputKey,
}: {
  inputBucket: string;
  inputKey: string;
}) {
  try {
    const outputs: { quality: string; key: string; bucket: string }[] = [];

    const baseId = crypto.randomUUID();
    const outputBucket = 'processed-videos';
    // This method gets the S3 video stream for each format. Not the best way to do this
    // The better way would be to configure ffmpeg to output in all formats in parallel. Will try that later
    for (const format of formats) {
      console.log(`Processing ${format.name}`);

      const inputStream = await s3Service.getS3Stream(inputBucket, inputKey);

      if (!inputStream) {
        throw new Error(`S3 stream missing for ${inputBucket}/${inputKey}`);
      }

      const outputKey = `videos/${baseId}/renditions/${format.name}.mp4`;

      const ffmpeg = spawn('ffmpeg', [
        '-i',
        'pipe:0',
        '-vf',
        `scale=${format.scale}`,
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-movflags',
        'frag_keyframe+empty_moov',
        '-f',
        'mp4',
        'pipe:1',
      ]);

      inputStream.pipe(ffmpeg.stdin);

      const upload = new Upload({
        client: s3,
        params: {
          Bucket: outputBucket,
          Key: outputKey,
          Body: ffmpeg.stdout,
        },
      });

      await Promise.all([
        upload.done(),
        new Promise<void>((resolve, reject) => {
          ffmpeg.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`ffmpeg exited with code ${code}`));
          });

          ffmpeg.on('error', reject);
        }),
      ]);

      outputs.push({
        quality: format.name,
        key: outputKey,
        bucket: outputBucket,
      });
    }
    await producer.send({
      topic: 'video.processed',
      messages: [
        {
          value: JSON.stringify({
            inputBucket,
            inputKey,
            status: 'completed',
            outputs,
          }),
        },
      ],
    });

    console.log('Kafka event emitted');
  } catch (err) {
    console.log('ERR-SERVER:', err);
  }
}
