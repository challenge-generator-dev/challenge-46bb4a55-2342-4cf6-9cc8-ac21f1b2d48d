import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderProduct, OrderStatus } from '../../domain/entities/order.entity';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  private readonly logger = new Logger(OrderRepositoryImpl.name);
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(docClient: DynamoDBDocumentClient, tableName: string) {
    this.docClient = docClient;
    this.tableName = tableName;
  }

  private mapToOrder(item: any): Order | null {
    if (!item) return null;

    const products: OrderProduct[] = (item.products || []).map(
      (p: any) => new OrderProduct(p.productId, p.name, p.quantity, p.price)
    );

    const order = new Order(
      item.clientId,
      products,
      item.status as OrderStatus,
      item.id,
      new Date(item.createdAt),
      new Date(item.updatedAt)
    );

    return order;
  }

  private mapToItem(order: Order): Record<string, any> {
    return {
      id: order.id,
      clientId: order.clientId,
      status: order.status,
      products: (order.products as OrderProduct[]).map(p => ({
        productId: p.productId,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  async create(order: Order): Promise<Order> {
    this.logger.log(`Creating order with id: ${order.id}`);
    
    const item = this.mapToItem(order);
    
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(id)',
      })
    );

    this.logger.log(`Order created successfully: ${order.id}`);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    this.logger.log(`Finding order by id: ${id}`);

    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id },
      })
    );

    return this.mapToOrder(result.Item);
  }

  async update(order: Order): Promise<Order> {
    this.logger.log(`Updating order with id: ${order.id}`);

    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (order.clientId) {
      updateExpressions.push('clientId = :clientId');
      expressionAttributeValues[':clientId'] = order.clientId;
    }

    if (order.products) {
      updateExpressions.push('products = :products');
      expressionAttributeValues[':products'] = (order.products as OrderProduct[]).map(p => ({
        productId: p.productId,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      }));
    }

    if (order.status) {
      updateExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = order.status;
    }

    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id: order.id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    this.logger.log(`Order updated successfully: ${order.id}`);
    return this.mapToOrder(result.Attributes);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting order with id: ${id}`);

    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      })
    );

    this.logger.log(`Order deleted successfully: ${id}`);
  }

  async findByClientId(clientId: string): Promise<Order[]> {
    this.logger.log(`Finding orders by clientId: ${clientId}`);

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'clientId-index',
        KeyConditionExpression: 'clientId = :clientId',
        ExpressionAttributeValues: {
          ':clientId': clientId,
        },
      })
    );

    return (result.Items || []).map(item => this.mapToOrder(item)).filter((o): o is Order => o !== null);
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    this.logger.log(`Finding orders by status: ${status}`);

    const result = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
          ':status': status,
        },
      })
    );

    return (result.Items || []).map(item => this.mapToOrder(item)).filter((o): o is Order => o !== null);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    this.logger.log(`Finding orders by date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const result = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'createdAt >= :startDate AND createdAt <= :endDate',
        ExpressionAttributeValues: {
          ':startDate': startDate.toISOString(),
          ':endDate': endDate.toISOString(),
        },
      })
    );

    return (result.Items || []).map(item => this.mapToOrder(item)).filter((o): o is Order => o !== null);
  }
}