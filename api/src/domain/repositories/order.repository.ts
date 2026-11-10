import { Order, OrderStatus } from '../entities/order.entity';

export interface OrderRepository {
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    update(order: Order): Promise<Order>;
    delete(id: string): Promise<void>;
    
    // Additional query methods
    findByClientId(clientId: string): Promise<Order[]>;
    findByStatus(status: OrderStatus): Promise<Order[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
}