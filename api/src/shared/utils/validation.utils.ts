import { OrderStatus, OrderProduct } from '../../domain/entities/order.entity';
import {
    DuplicateProductException,
    ClientNotFoundException,
    OrderHasNoProductsException,
    OrderLimitExceededException,
    InvalidOrderStatusException,
} from '../exceptions/order.exceptions';

const MAX_PRODUCTS_PER_ORDER = 50;
const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [],
};

const VALID_CLIENT_IDS = new Set([
    'client-001',
    'client-002',
    'client-003',
    'client-004',
    'client-005',
    'client-006',
    'client-007',
    'client-008',
    'client-009',
    'client-010',
]);

export function validateNoDuplicateProducts(products: OrderProduct[]): void {
    if (!products || products.length === 0) {
        return;
    }

    const productIds = products.map((p) => p.productId);
    const uniqueProductIds = new Set(productIds);

    if (productIds.length !== uniqueProductIds.size) {
        const duplicates = productIds.filter((id, index) => productIds.indexOf(id) !== index);
        const uniqueDuplicates = [...new Set(duplicates)];
        throw new DuplicateProductException(uniqueDuplicates);
    }
}

export function validateClientExists(clientId: string): void {
    if (!clientId || clientId.trim().length === 0) {
        throw new ClientNotFoundException(clientId || 'undefined');
    }

    if (!VALID_CLIENT_IDS.has(clientId)) {
        throw new ClientNotFoundException(clientId);
    }
}

export function validateOrderHasProducts(products: OrderProduct[]): void {
    if (!products || products.length === 0) {
        throw new OrderHasNoProductsException();
    }
}

export function validateProductLimit(products: OrderProduct[]): void {
    if (products && products.length > MAX_PRODUCTS_PER_ORDER) {
        throw new OrderLimitExceededException(MAX_PRODUCTS_PER_ORDER, products.length);
    }
}

export function validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    if (currentStatus === newStatus) {
        return;
    }

    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];

    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
        throw new InvalidOrderStatusException(currentStatus, newStatus);
    }
}

export function validateProductQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('La cantidad del producto debe ser un número entero positivo');
    }
}

export function validateProductPrice(price: number): void {
    if (typeof price !== 'number' || price < 0) {
        throw new Error('El precio del producto debe ser un número no negativo');
    }
}

export function validateProductData(product: OrderProduct): void {
    if (!product.productId || product.productId.trim().length === 0) {
        throw new Error('El ID del producto es requerido');
    }

    if (!product.name || product.name.trim().length === 0) {
        throw new Error('El nombre del producto es requerido');
    }

    validateProductQuantity(product.quantity);
    validateProductPrice(product.price);
}

export function validateAllProducts(products: OrderProduct[]): void {
    validateOrderHasProducts(products);
    validateProductLimit(products);
    validateNoDuplicateProducts(products);

    products.forEach((product, index) => {
        try {
            validateProductData(product);
        } catch (error) {
            throw new Error(`Error en el producto ${index + 1}: ${(error as Error).message}`);
        }
    });
}

export function validateOrderId(id: string): void {
    if (!id || id.trim().length === 0) {
        throw new Error('El ID de la orden es requerido');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        throw new Error('El ID de la orden debe ser un UUID válido');
    }
}

export function calculateOrderTotal(products: OrderProduct[]): number {
    if (!products || products.length === 0) {
        return 0;
    }

    return products.reduce((total, product) => {
        return total + product.price * product.quantity;
    }, 0);
}

export function sanitizeOrderInput(input: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
        if (typeof value === 'string') {
            sanitized[key] = value.trim();
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

export function isValidStatus(status: string): status is OrderStatus {
    return Object.values(OrderStatus).includes(status as OrderStatus);
}

export function normalizeStatus(status: string): OrderStatus {
    const upperStatus = status.toUpperCase();

    if (!isValidStatus(upperStatus)) {
        throw new Error(`Estado inválido: ${status}`);
    }

    return upperStatus as OrderStatus;
}