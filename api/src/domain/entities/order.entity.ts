import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export class OrderProduct {
    constructor(
        public readonly productId: string,
        public readonly name: string,
        public readonly quantity: number,
        public readonly price: number
    ) {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
        if (price <= 0) {
            throw new Error('Price must be greater than zero');
        }
    }
}

export class Order {
    public readonly id: string;
    public readonly createdAt: Date;
    public updatedAt: Date;
    public status: OrderStatus;

    constructor(
        public clientId: string,
        public products: OrderProduct[],
        status?: OrderStatus,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id || uuidv4();
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.status = status || OrderStatus.PENDING;
        
        if (!clientId || clientId.trim() === '') {
            throw new Error('Client ID cannot be empty');
        }
        if (!products || products.length === 0) {
            throw new Error('Order must have at least one product');
        }
        
        const productIds = new Set<string>();
        for (const product of products) {
            if (productIds.has(product.productId)) {
                throw new Error(`Duplicate product found: ${product.productId}`);
            }
            productIds.add(product.productId);
        }
    }
    
    updateStatus(newStatus: OrderStatus): void {
        if (this.status === OrderStatus.COMPLETED || this.status === OrderStatus.CANCELLED) {
            throw new Error(`Order cannot be updated from ${this.status} status`);
        }
        this.status = newStatus;
        this.updatedAt = new Date();
    }
    
    updateProducts(newProducts: OrderProduct[]): void {
        if (newProducts.length === 0) {
            throw new Error('Order must have at least one product');
        }
        
        const productIds = new Set<string>();
        for (const product of newProducts) {
            if (productIds.has(product.productId)) {
                throw new Error(`Duplicate product found: ${product.productId}`);
            }
            productIds.add(product.productId);
        }
        
        this.products = newProducts;
        this.updatedAt = new Date();
    }
}