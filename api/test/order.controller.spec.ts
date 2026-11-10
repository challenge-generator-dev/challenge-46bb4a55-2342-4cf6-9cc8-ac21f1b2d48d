import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OrderController } from '../src/infrastructure/controllers/order.controller';
import { OrderService } from '../src/application/services/order.service';
import { OrderStatus } from '../src/domain/entities/order.entity';
import { OrderResponseDto } from '../src/application/dto/create-order.dto';
import { OrderNotFoundException } from '../src/shared/exceptions/order.exceptions';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let service: jest.Mocked<OrderService>;

  const mockOrderResponse: OrderResponseDto = {
    id: 'order-123',
    clientId: 'client-123',
    products: [{ productId: 'prod-1', name: 'Product 1', quantity: 2, price: 100 }],
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  };

  const mockOrderService = {
    createOrder: jest.fn(),
    getOrder: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
    getOrdersByClient: jest.fn(),
    getOrdersByStatus: jest.fn(),
    getOrdersByDateRange: jest.fn()
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService
        }
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    service = moduleFixture.get<OrderService>(OrderService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('debería crear una orden exitosamente', async () => {
      mockOrderService.createOrder.mockResolvedValue(mockOrderResponse);

      const createDto = {
        clientId: 'client-123',
        products: [{ productId: 'prod-1', name: 'Product 1', quantity: 2, price: 100 }]
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createDto)
        .expect(201);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(createDto);
      expect(response.body.id).toBeDefined();
    });

    it('debería retornar 400 para datos inválidos', async () => {
      const invalidDto = { clientId: '', products: [] };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /orders/:id', () => {
    it('debería obtener una orden por ID', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockOrderResponse);

      const response = await request(app.getHttpServer())
        .get('/orders/order-123')
        .expect(200);

      expect(mockOrderService.getOrder).toHaveBeenCalledWith('order-123');
      expect(response.body.id).toBe('order-123');
    });

    it('debería retornar 404 cuando la orden no existe', async () => {
      mockOrderService.getOrder.mockRejectedValue(new OrderNotFoundException('non-existent'));

      await request(app.getHttpServer())
        .get('/orders/non-existent')
        .expect(404);
    });

    it('debería retornar 400 para ID inválido', async () => {
      await request(app.getHttpServer())
        .get('/orders/invalid-uuid')
        .expect(400);
    });
  });

  describe('PUT /orders/:id', () => {
    it('debería actualizar una orden exitosamente', async () => {
      const updatedResponse = { ...mockOrderResponse, status: OrderStatus.PROCESSING };
      mockOrderService.updateOrder.mockResolvedValue(updatedResponse);

      const updateDto = { status: OrderStatus.PROCESSING };

      const response = await request(app.getHttpServer())
        .put('/orders/order-123')
        .send(updateDto)
        .expect(200);

      expect(mockOrderService.updateOrder).toHaveBeenCalled();
      expect(response.body.status).toBe(OrderStatus.PROCESSING);
    });

    it('debería retornar 404 cuando la orden no existe', async () => {
      mockOrderService.updateOrder.mockRejectedValue(new OrderNotFoundException('non-existent'));

      const updateDto = { status: OrderStatus.COMPLETED };

      await request(app.getHttpServer())
        .put('/orders/non-existent')
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('debería eliminar una orden exitosamente', async () => {
      mockOrderService.deleteOrder.mockResolvedValue();

      await request(app.getHttpServer())
        .delete('/orders/order-123')
        .expect(204);

      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith('order-123');
    });

    it('debería retornar 404 cuando la orden no existe', async () => {
      mockOrderService.deleteOrder.mockRejectedValue(new OrderNotFoundException('non-existent'));

      await request(app.getHttpServer())
        .delete('/orders/non-existent')
        .expect(404);
    });
  });

  describe('GET /orders/client/:clientId', () => {
    it('debería obtener órdenes por cliente', async () => {
      mockOrderService.getOrdersByClient.mockResolvedValue([mockOrderResponse]);

      const response = await request(app.getHttpServer())
        .get('/orders/client/client-123')
        .expect(200);

      expect(mockOrderService.getOrdersByClient).toHaveBeenCalledWith('client-123');
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /orders/status/:status', () => {
    it('debería obtener órdenes por estado', async () => {
      mockOrderService.getOrdersByStatus.mockResolvedValue([mockOrderResponse]);

      const response = await request(app.getHttpServer())
        .get('/orders/status/PENDING')
        .expect(200);

      expect(mockOrderService.getOrdersByStatus).toHaveBeenCalledWith(OrderStatus.PENDING);
      expect(response.body).toHaveLength(1);
    });

    it('debería retornar 400 para estado inválido', async () => {
      await request(app.getHttpServer())
        .get('/orders/status/INVALID_STATUS')
        .expect(400);
    });
  });
});