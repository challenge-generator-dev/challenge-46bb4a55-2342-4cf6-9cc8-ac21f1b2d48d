import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
  ParseUUIDPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto, OrderResponseDto } from '../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../application/dto/update-order.dto';
import { OrderStatus, Order } from '../../domain/entities/order.entity';
import { OrderNotFoundException, InvalidOrderDataException } from '../../shared/exceptions/order.exceptions';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  @ApiResponse({ status: 409, description: 'Order already exists' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    this.logger.log(`Creating order for client: ${createOrderDto.clientId}`);

    try {
      createOrderDto.validate();
    } catch (error) {
      throw new BadRequestException(`Invalid order data: ${(error as Error).message}`);
    }

    const order = await this.orderService.createOrder(createOrderDto);
    return order;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order UUID', type: String })
  @ApiResponse({ status: 200, description: 'Order found', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(@Param('id', ParseUUIDPipe) id: string): Promise<OrderResponseDto> {
    this.logger.log(`Fetching order: ${id}`);

    const order = await this.orderService.getOrder(id);
    
    if (!order) {
      throw new OrderNotFoundException(id);
    }

    return order;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', description: 'Order UUID', type: String })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<OrderResponseDto> {
    this.logger.log(`Updating order: ${id}`);

    const existingOrder = await this.orderService.getOrder(id);
    
    if (!existingOrder) {
      throw new OrderNotFoundException(id);
    }

    updateOrderDto.id = id;
    
    try {
      updateOrderDto.validate();
    } catch (error) {
      throw new BadRequestException(`Invalid update data: ${(error as Error).message}`);
    }

    const updatedOrder = await this.orderService.updateOrder(updateOrderDto);
    return updatedOrder;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'Order UUID', type: String })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async deleteOrder(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.log(`Deleting order: ${id}`);

    const existingOrder = await this.orderService.getOrder(id);
    
    if (!existingOrder) {
      throw new OrderNotFoundException(id);
    }

    await this.orderService.deleteOrder(id);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get all orders for a client' })
  @ApiParam({ name: 'clientId', description: 'Client UUID', type: String })
  @ApiResponse({ status: 200, description: 'Orders found', type: [OrderResponseDto] })
  async getOrdersByClient(@Param('clientId', ParseUUIDPipe) clientId: string): Promise<OrderResponseDto[]> {
    this.logger.log(`Fetching orders for client: ${clientId}`);

    const orders = await this.orderService.getOrdersByClient(clientId);
    return orders;
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get all orders by status' })
  @ApiParam({ name: 'status', description: 'Order status', enum: OrderStatus, type: String })
  @ApiResponse({ status: 200, description: 'Orders found', type: [OrderResponseDto] })
  async getOrdersByStatus(@Param('status') status: string): Promise<OrderResponseDto[]> {
    this.logger.log(`Fetching orders by status: ${status}`);

    const orderStatus = Object.values(OrderStatus).find(s => s === status.toUpperCase());
    
    if (!orderStatus) {
      throw new BadRequestException(`Invalid status: ${status}. Valid values: ${Object.values(OrderStatus).join(', ')}`);
    }

    const orders = await this.orderService.getOrdersByStatus(orderStatus);
    return orders;
  }
}