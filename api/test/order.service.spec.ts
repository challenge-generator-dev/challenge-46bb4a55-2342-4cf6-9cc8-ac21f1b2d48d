import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../src/application/services/order.service';
import { OrderRepository } from '../src/domain/repositories/order.repository';
import { Order, OrderStatus, OrderProduct } from '../src/domain/entities/order.entity';
import { CreateOrderDto } from '../src/application/dto/create-order.dto';
import { UpdateOrderDto } from '../src/application/dto/update-order.dto';
import { OrderResponseDto } from '../src/application/dto/create-order.dto';
import { OrderNotFoundException, InvalidOrderStatusException } from '../src/shared/exceptions/order.exceptions';

describe('OrderService', () => {
  let service: OrderService;
  let repository: jest.Mocked<OrderRepository>;

  const mockOrderProduct = new OrderProduct('prod-1', 'Product 1', 2, 100);
  const mockOrder: Order = new Order(
    'client-123',
    [mockOrderProduct],
    OrderStatus.PENDING,
    'order-123',
    new Date('2024-01-15'),
    new Date('2024-01-15')
  );

  const mockOrderResponse: OrderResponseDto = {
    id: 'order-123',
    clientId: 'client-123',
    products: [{ productId: 'prod-1', name: 'Product 1', quantity: 2, price: 100 }],
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  };

  const createOrderDto: CreateOrderDto = {
    clientId: 'client-123',
    products: [{ productId: 'prod-1', name: 'Product 1', quantity: 2, price: 100 }],
    validate: () => {}
  };

  const updateOrderDto: UpdateOrderDto = {
    id: 'order-123',
    status: OrderStatus.PROCESSING,
    validate: () => {}
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByClientId: jest.fn(),
      findByStatus: jest.fn(),
      findByDateRange: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: mockRepository
        }
      ]
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get(OrderRepository);
  });

  describe('createOrder', () => {
    it('debería crear una orden exitosamente', async () => {
      repository.create.mockResolvedValue(mockOrder);

      const result = await service.createOrder(createOrderDto);

      expect(repository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.clientId).toBe(createOrderDto.clientId);
    });

    it('debería lanzar excepción cuando falla la creación', async () => {
      repository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createOrder(createOrderDto)).rejects.toThrow();
    });
  });

  describe('getOrder', () => {
    it('debería obtener una orden por ID', async () => {
      repository.findById.mockResolvedValue(mockOrder);

      const result = await service.getOrder('order-123');

      expect(repository.findById).toHaveBeenCalledWith('order-123');
      expect(result).toBeDefined();
      expect(result.id).toBe('order-123');
    });

    it('debería lanzar OrderNotFoundException cuando la orden no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getOrder('non-existent')).rejects.toThrow(OrderNotFoundException);
    });
  });

  describe('updateOrder', () => {
    it('debería actualizar una orden exitosamente', async () => {
      const updatedOrder = { ...mockOrder, status: OrderStatus.PROCESSING };
      repository.findById.mockResolvedValue(mockOrder);
      repository.update.mockResolvedValue(updatedOrder as Order);

      const result = await service.updateOrder(updateOrderDto);

      expect(repository.update).toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.PROCESSING);
    });

    it('debería lanzar excepción cuando la orden no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.updateOrder(updateOrderDto)).rejects.toThrow(OrderNotFoundException);
    });

    it('debería lanzar excepción para transición de estado inválida', async () => {
      repository.findById.mockResolvedValue(mockOrder);

      const invalidUpdate: UpdateOrderDto = {
        id: 'order-123',
        status: OrderStatus.CANCELLED,
        validate: () => {}
      };

      await expect(service.updateOrder(invalidUpdate)).rejects.toThrow(InvalidOrderStatusException);
    });
  });

  describe('deleteOrder', () => {
    it('debería eliminar una orden exitosamente', async () => {
      repository.findById.mockResolvedValue(mockOrder);
      repository.delete.mockResolvedValue();

      await service.deleteOrder('order-123');

      expect(repository.delete).toHaveBeenCalledWith('order-123');
    });

    it('debería lanzar excepción cuando la orden no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteOrder('non-existent')).rejects.toThrow(OrderNotFoundException);
    });
  });

  describe('getOrdersByClient', () => {
    it('debería obtener órdenes por cliente', async () => {
      const orders = [mockOrder];
      repository.findByClientId.mockResolvedValue(orders);

      const result = await service.getOrdersByClient('client-123');

      expect(repository.findByClientId).toHaveBeenCalledWith('client-123');
      expect(result).toHaveLength(1);
    });
  });

  describe('getOrdersByStatus', () => {
    it('debería obtener órdenes por estado', async () => {
      const orders = [mockOrder];
      repository.findByStatus.mockResolvedValue(orders);

      const result = await service.getOrdersByStatus(OrderStatus.PENDING);

      expect(repository.findByStatus).toHaveBeenCalledWith(OrderStatus.PENDING);
      expect(result).toHaveLength(1);
    });
  });

  describe('getOrdersByDateRange', () => {
    it('debería obtener órdenes por rango de fechas', async () => {
      const orders = [mockOrder];
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      repository.findByDateRange.mockResolvedValue(orders);

      const result = await service.getOrdersByDateRange(startDate, endDate);

      expect(repository.findByDateRange).toHaveBeenCalledWith(startDate, endDate);
      expect(result).toHaveLength(1);
    });
  });
});