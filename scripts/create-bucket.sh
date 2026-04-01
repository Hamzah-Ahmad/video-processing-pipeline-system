# exit immediately if any command fails
set -e

BUCKET_NAME="uploaded-videos"

echo "Creating S3 bucket: $BUCKET_NAME..."
awslocal s3 mb s3://$BUCKET_NAME

echo "Bucket created successfully"
