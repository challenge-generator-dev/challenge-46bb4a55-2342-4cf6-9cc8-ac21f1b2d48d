import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus, OrderProduct } from '../../domain/entities/order.entity';
import { CreateOrderDto, OrderResponseDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { InvalidOrderDataException } from '../../shared/exceptions/order.exceptions';

@Injectable()
export class OrderService {
    constructor(private readonly orderRepository: OrderRepository) {}

    async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
        try {
            createOrderDto.validate();

            const products = createOrderDto.products.map(
                p => new OrderProduct(p.productId, p.name, p.quantity, p.price)
            );

            const order = new Order(
                createOrderDto.clientId,
                products,
                createOrderDto.status || OrderStatus.PENDING
            );

            const createdOrder = await this.orderRepository.create(order);
            return OrderResponseDto.fromOrder(createdOrder);
        } catch (error) {
            if (error instanceof InvalidOrderDataException) {
                throw new BadRequestException(error.message);
            }
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new InternalServerErrorException('Error al crear la orden: ' + errorMessage);
        }
    }

    async getOrder(id: string): Promise<OrderResponseDto> {
        if (!id || id.trim() === '') {
            throw new BadRequestException('El ID de la orden es requerido');
        }

        const order = await this.orderRepository.findById(id);
        
        if (!order) {
            throw new NotFoundException(`Orden con ID ${id} no encontrada`);
        }

        return OrderResponseDto.fromOrder(order);
    }

    async updateOrder(updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
        if (!updateOrderDto.id || updateOrderDto.id.trim() === '') {
            throw new BadRequestException('El ID de la orden es requerido para la actualización');
        }

        const existingOrder = await this.orderRepository.findById(updateOrderDto.id);
        
        if (!existingOrder) {
            throw new NotFoundException(`Orden con ID ${updateOrderDto.id} no encontrada para actualizar`);
        }

        try {
            updateOrderDto.validate();

            if (updateOrderDto.clientId !== undefined && updateOrderDto.clientId !== null) {
                existingOrder.clientId = updateOrderDto.clientId;
            }

            if (updateOrderDto.products !== undefined && updateOrderDto.products !== null) {
                const updatedProducts = updateOrderDto.products.map(
                    p => new OrderProduct(p.productId, p.name, p.quantity, p.price)
                );
                existingOrder.updateProducts(updatedProducts);
            }

            if (updateOrderDto.status !== undefined && updateOrderDto.status !== null) {
                this.validateStatusTransition(existingOrder.status, updateOrderDto.status);
                existingOrder.updateStatus(updateOrderDto.status);
            }

            const updatedOrder = await this.orderRepository.update(existingOrder);
            return OrderResponseDto.fromOrder(updatedOrder);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new InternalServerErrorException('Error al actualizar la orden: ' + errorMessage);
        }
    }

    async deleteOrder(id: string): Promise<void> {
        if (!id || id.trim() === '') {
            throw new BadRequestException('El ID de la orden es requerido para eliminar');
        }

        const existingOrder = await this.orderRepository.findById(id);
        
        if (!existingOrder) {
            throw new NotFoundException(`Orden con ID ${id} no encontrada para eliminar`);
        }

        await this.orderRepository.delete(id);
    }

    private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
            [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
            [OrderStatus.COMPLETED]: [],
            [OrderStatus.CANCELLED]: []
        };

        const allowedStatuses = validTransitions[currentStatus];
        
        if (!allowedStatuses.includes(newStatus)) {
            throw new BadRequestException(
                `No se puede transiciónar de ${currentStatus} a ${newStatus}. ` +
                `Estados permitidos desde ${currentStatus}: ${allowedStatuses.join(', ') || 'ninguno'}`
            );
        }
    }

    async getOrdersByClient(clientId: string): Promise<OrderResponseDto[]> {
        if (!clientId || clientId.trim() === '') {
            throw new BadRequestException('El ID del cliente es requerido');
        }

        const orders = await this.orderRepository.findByClientId(clientId);
        return orders.map(order => OrderResponseDto.fromOrder(order));
    }

    async getOrdersByStatus(status: OrderStatus): Promise<OrderResponseDto[]> {
        const orders = await this.orderRepository.findByStatus(status);
        return orders.map(order => OrderResponseDto.fromOrder(order));
    }

    async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<OrderResponseDto[]> {
        if (!startDate || !endDate) {
            throw new BadRequestException('Las fechas de inicio y fin son requeridas');
        }

        if (startDate > endDate) {
            throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
        }

        const orders = await this.orderRepository.findByDateRange(startDate, endDate);
        return orders.map(order => OrderResponseDto.fromOrder(order));
    }
}