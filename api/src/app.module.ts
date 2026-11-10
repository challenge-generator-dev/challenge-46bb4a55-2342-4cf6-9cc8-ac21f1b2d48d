import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/services/order.service';
import { OrderRepositoryImpl } from './infrastructure/repositories/order.repository.impl';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    {
      provide: 'DYNAMODB_CLIENT',
      useFactory: () => {
        const client = new DynamoDBClient({
          region: process.env.AWS_REGION || 'us-east-1',
          endpoint: process.env.DYNAMODB_ENDPOINT,
          credentials: process.env.AWS_ACCESS_KEY_ID
            ? {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
              }
            : undefined,
        });
        return client;
      },
    },
    {
      provide: 'DYNAMODB_DOCUMENT_CLIENT',
      inject: ['DYNAMODB_CLIENT'],
      useFactory: (client: DynamoDBClient) => {
        return DynamoDBDocumentClient.from(client, {
          marshallOptions: {
            removeUndefinedValues: true,
            convertClassInstanceToMap: true,
          },
          unmarshallOptions: {
            wrapNumbers: false,
          },
        });
      },
    },
    {
      provide: 'DYNAMODB_TABLE_NAME',
      useValue: process.env.DYNAMODB_TABLE_NAME || 'orders-dev',
    },
    {
      provide: OrderRepositoryImpl,
      inject: ['DYNAMODB_DOCUMENT_CLIENT', 'DYNAMODB_TABLE_NAME'],
      useFactory: (docClient: DynamoDBDocumentClient, tableName: string) => {
        return new OrderRepositoryImpl(docClient, tableName);
      },
    },
    {
      provide: OrderService,
      inject: [OrderRepositoryImpl],
      useFactory: (orderRepository: OrderRepositoryImpl) => {
        return new OrderService(orderRepository);
      },
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}