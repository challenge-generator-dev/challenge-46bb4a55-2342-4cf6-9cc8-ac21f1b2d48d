import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderException extends HttpException {
    constructor(
        message: string,
        status: HttpStatus,
        public readonly code?: string,
        public readonly details?: Record<string, unknown>,
    ) {
        super(
            {
                statusCode: status,
                message: message,
                error: HttpStatus[status],
                code: code,
                details: details,
                timestamp: new Date().toISOString(),
            },
            status,
        );
    }
}

export class OrderNotFoundException extends OrderException {
    constructor(orderId: string) {
        super(
            `La orden con ID '${orderId}' no fue encontrada en el sistema`,
            HttpStatus.NOT_FOUND,
            'ORDER_NOT_FOUND',
            { orderId, suggestion: 'Verifique que el ID de la orden sea correcto' },
        );
    }
}

export class OrderAlreadyExistsException extends OrderException {
    constructor(orderId: string) {
        super(
            `Ya existe una orden con el ID '${orderId}' en el sistema`,
            HttpStatus.CONFLICT,
            'ORDER_ALREADY_EXISTS',
            { orderId, suggestion: 'Use un ID único para la nueva orden' },
        );
    }
}

export class InvalidOrderDataException extends OrderException {
    constructor(reason: string, details?: Record<string, unknown>) {
        super(
            `Los datos de la orden son inválidos: ${reason}`,
            HttpStatus.BAD_REQUEST,
            'INVALID_ORDER_DATA',
            details,
        );
    }
}

export class DuplicateProductException extends OrderException {
    constructor(duplicateProducts: string[]) {
        super(
            `Se detectaron productos duplicados en la orden: ${duplicateProducts.join(', ')}`,
            HttpStatus.BAD_REQUEST,
            'DUPLICATE_PRODUCTS',
            {
                duplicateProducts,
                suggestion: 'Elimine los productos duplicados o agrupe las cantidades del mismo producto',
            },
        );
    }
}

export class ClientNotFoundException extends OrderException {
    constructor(clientId: string) {
        super(
            `El cliente con ID '${clientId}' no existe en el sistema`,
            HttpStatus.BAD_REQUEST,
            'CLIENT_NOT_FOUND',
            { clientId, suggestion: 'Verifique que el ID del cliente sea válido' },
        );
    }
}

export class InvalidOrderStatusException extends OrderException {
    constructor(currentStatus: string, requestedStatus: string) {
        super(
            `No se puede cambiar el estado de '${currentStatus}' a '${requestedStatus}'`,
            HttpStatus.UNPROCESSABLE_ENTITY,
            'INVALID_STATUS_TRANSITION',
            {
                currentStatus,
                requestedStatus,
                validTransitions: {
                    PENDING: ['PROCESSING', 'CANCELLED'],
                    PROCESSING: ['COMPLETED', 'CANCELLED'],
                    COMPLETED: [],
                    CANCELLED: [],
                },
            },
        );
    }
}

export class OrderHasNoProductsException extends OrderException {
    constructor() {
        super(
            'La orden debe contener al menos un producto',
            HttpStatus.BAD_REQUEST,
            'ORDER_WITHOUT_PRODUCTS',
            { suggestion: 'Agregue productos a la orden antes de guardarla' },
        );
    }
}

export class OrderLimitExceededException extends OrderException {
    constructor(limit: number, current: number) {
        super(
            `Se excedió el límite máximo de productos por orden (${limit}). Actualmente hay ${current} productos`,
            HttpStatus.BAD_REQUEST,
            'ORDER_LIMIT_EXCEEDED',
            { limit, current, suggestion: 'Reduzca la cantidad de productos o cree múltiples órdenes' },
        );
    }
}

export class DatabaseOrderException extends OrderException {
    constructor(operation: string, originalError: Error) {
        super(
            `Error en la base de datos al realizar la operación '${operation}': ${originalError.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
            'DATABASE_ERROR',
            { operation, originalError: originalError.message },
        );
    }
}

export class OrderValidationException extends OrderException {
    constructor(validationErrors: string[]) {
        super(
            `Error de validación en la orden`,
            HttpStatus.BAD_REQUEST,
            'ORDER_VALIDATION_ERROR',
            { validationErrors },
        );
    }
}