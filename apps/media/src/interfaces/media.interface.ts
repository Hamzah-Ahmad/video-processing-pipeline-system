import { MediaStatus } from "../entities/media.entity";

export interface TranscodeOutput {
  quality: string;
  bucket: string;
  key: string;
}

export interface TranscodeCompletedEvent {
  inputBucket: string;
  inputKey: string;
  outputs: TranscodeOutput[];
}
