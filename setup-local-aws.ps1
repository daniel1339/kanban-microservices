# Script to create local AWS resources in LocalStack

# Create S3 bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://mi-bucket-local

# Create DynamoDB table
aws --endpoint-url=http://localhost:4566 dynamodb create-table `
  --table-name users `
  --attribute-definitions AttributeName=id,AttributeType=S `
  --key-schema AttributeName=id,KeyType=HASH `
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

# Create SQS queue
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name my-queue 