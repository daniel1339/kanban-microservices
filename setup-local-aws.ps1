# Script para crear recursos AWS locales en LocalStack

# Crear bucket S3
aws --endpoint-url=http://localhost:4566 s3 mb s3://mi-bucket-local

# Crear tabla DynamoDB
aws --endpoint-url=http://localhost:4566 dynamodb create-table `
  --table-name users `
  --attribute-definitions AttributeName=id,AttributeType=S `
  --key-schema AttributeName=id,KeyType=HASH `
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

# Crear cola SQS
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name my-queue 