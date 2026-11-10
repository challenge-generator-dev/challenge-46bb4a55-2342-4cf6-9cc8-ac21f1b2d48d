import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
const DYNAMODB_REGION = process.env.DYNAMODB_REGION || 'us-east-1';
const DYNAMODB_ACCESS_KEY_ID = process.env.DYNAMODB_ACCESS_KEY_ID || 'local';
const DYNAMODB_SECRET_ACCESS_KEY = process.env.DYNAMODB_SECRET_ACCESS_KEY || 'local';

const isLocal = process.env.NODE_ENV !== 'production' && DYNAMODB_ENDPOINT.includes('localhost');

const clientConfig: any = {
  region: DYNAMODB_REGION,
  credentials: isLocal
    ? { accessKeyId: DYNAMODB_ACCESS_KEY_ID, secretAccessKey: DYNAMODB_SECRET_ACCESS_KEY }
    : undefined,
};

if (isLocal) {
  clientConfig.endpoint = DYNAMODB_ENDPOINT;
  clientConfig.tls = false;
}

export const dynamoDBClient = new DynamoDBClient(clientConfig);

export const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME || 'orders';

export interface DynamoDBConfig {
  client: DynamoDBClient;
  documentClient: DynamoDBDocumentClient;
  tableName: string;
}

export function getDynamoDBConfig(): DynamoDBConfig {
  return {
    client: dynamoDBClient,
    documentClient: dynamoDBDocumentClient,
    tableName: ORDERS_TABLE_NAME,
  };
}