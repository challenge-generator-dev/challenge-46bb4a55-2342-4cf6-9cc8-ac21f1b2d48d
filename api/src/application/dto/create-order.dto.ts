import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/entities/order.entity';

export class CreateOrderProductDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0.01)
    price: number;
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    clientId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderProductDto)
    products: CreateOrderProductDto[];

    @IsOptional()
    @IsString()
    status?: OrderStatus;
    
    validate(): void {
        if (!this.products || this.products.length === 0) {
            throw new Error('Order must have at least one product');
        }
        
        const productIds = new Set<string>();
        for (const product of this.products) {
            if (productIds.has(product.productId)) {
                throw new Error(`Duplicate product found: ${product.productId}`);
            }
            productIds.add(product.productId);
        }
    }
}

export class OrderResponseDto {
    public readonly id: string;
    public readonly clientId: string;
    private _products: { productId: string; name: string; quantity: number; price: number; }[];
    public status: OrderStatus;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(
        id: string,
        clientId: string,
        products: { productId: string; name: string; quantity: number; price: number; }[],
        status: OrderStatus,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.clientId = clientId;
        this._products = products;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get products(): { productId: string; name: string; quantity: number; price: number; }[] {
        return this._products;
    }
    
    static fromOrder(order: any): OrderResponseDto {
        if (order instanceof OrderResponseDto) {
            return order;
        }
        return new OrderResponseDto(
            order.id,
            order.clientId,
            order.products.map((product: any) => ({
                productId: product.productId,
                name: product.name,
                quantity: product.quantity,
                price: product.price
            })),
            order.status,
            order.createdAt,
            order.updatedAt
        );
    }

    updateStatus(newStatus: OrderStatus): void {
        this.status = newStatus;
    }

    updateProducts(newProducts: any[]): void {
        this._products = newProducts.map(p => ({
            productId: p.productId,
            name: p.name,
            quantity: p.quantity,
            price: p.price
        }));
    }
}