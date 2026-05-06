#!/bin/bash
set -e  # exit immediately if any command fails

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUCKET_NAME="uploaded-videos"
PROCESSED_VIDEOS_BUCKET_NAME="processed-videos"

#############################
# 1️⃣ Create SQS Queues
#############################

echo "🚀 Creating Dead Letter Queue (DLQ)..."
awslocal sqs create-queue \
  --queue-name UploadVideoDLQ

echo "🔍 Fetching DLQ ARN..."
DLQ_ARN=$(awslocal sqs get-queue-attributes \
  --queue-url http://localhost:4566/000000000000/UploadVideoDLQ \
  --attribute-names QueueArn \
  --query 'Attributes.QueueArn' \
  --output text)

echo "📌 DLQ ARN: $DLQ_ARN"

echo "📦 Creating Main Queue with DLQ redrive policy..."
awslocal sqs create-queue \
  --queue-name UploadVideoQueue \
  --attributes "{\"RedrivePolicy\":\"{\\\"deadLetterTargetArn\\\":\\\"$DLQ_ARN\\\",\\\"maxReceiveCount\\\":\\\"5\\\"}\"}"

echo "✅ SQS setup complete!"

#############################
# 2️⃣ Create S3 Bucket
#############################

echo "Creating S3 bucket: $BUCKET_NAME..."
awslocal s3 mb s3://$BUCKET_NAME

echo "Applying CORS config..."
awslocal s3api put-bucket-cors \
  --bucket $BUCKET_NAME \
  --cors-configuration file://$SCRIPT_DIR/cors.json

echo "✅ Bucket created successfully"

#############################
# 2️⃣ Create Processed Videos S3 Bucket
#############################

echo "Creating S3 bucket: $PROCESSED_VIDEOS_BUCKET_NAME..."
awslocal s3 mb s3://$PROCESSED_VIDEOS_BUCKET_NAME

echo "Applying CORS config..."
awslocal s3api put-bucket-cors \
  --bucket $PROCESSED_VIDEOS_BUCKET_NAME \
  --cors-configuration file://$SCRIPT_DIR/cors.json

echo "✅ Bucket created successfully"

#############################
# 3️⃣ Configure S3 -> SQS Notification
#############################

echo "🔍 Fetching Main Queue ARN..."
MAIN_QUEUE_ARN=$(awslocal sqs get-queue-attributes \
  --queue-url http://localhost:4566/000000000000/UploadVideoQueue \
  --attribute-names QueueArn \
  --query 'Attributes.QueueArn' \
  --output text)

echo "📢 Configuring S3 event to trigger SQS..."
awslocal s3api put-bucket-notification-configuration \
  --bucket $BUCKET_NAME \
  --notification-configuration "{
    \"QueueConfigurations\": [
      {
        \"QueueArn\": \"$MAIN_QUEUE_ARN\",
        \"Events\": [\"s3:ObjectCreated:*\"] 
      }
    ]
  }"

echo "✅ S3 -> SQS event setup complete!"