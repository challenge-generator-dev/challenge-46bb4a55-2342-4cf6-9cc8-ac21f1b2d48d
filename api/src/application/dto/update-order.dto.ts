import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsNumber, Min, Max, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/entities/order.entity';

class UpdateOrderProductDto {
    @IsString({ message: 'El ID del producto debe ser una cadena de texto' })
    productId!: string;

    @IsString({ message: 'El nombre del producto debe ser una cadena de texto' })
    name!: string;

    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    @Min(1, { message: 'La cantidad mínima es 1' })
    @Max(999, { message: 'La cantidad máxima es 999' })
    quantity!: number;

    @IsNumber({}, { message: 'El precio debe ser un número' })
    @Min(0, { message: 'El precio no puede ser negativo' })
    price!: number;
}

export class UpdateOrderDto {
    @IsString({ message: 'El ID de la orden es obligatorio' })
    id!: string;

    @IsOptional()
    @IsString({ message: 'El ID del cliente debe ser una cadena de texto' })
    clientId?: string;

    @IsOptional()
    @IsArray({ message: 'Los productos deben ser un arreglo' })
    @ValidateNested({ each: true, message: 'Cada producto debe ser válido' })
    @Type(() => UpdateOrderProductDto)
    @ArrayMinSize(1, { message: 'Debe haber al menos un producto' })
    products?: UpdateOrderProductDto[];

    @IsOptional()
    @IsEnum(OrderStatus, { message: 'El estado debe ser uno de: PENDING, PROCESSING, COMPLETED, CANCELLED' })
    status?: OrderStatus;

    validate(): void {
        const hasClientId = this.clientId !== undefined && this.clientId !== null && this.clientId.trim() !== '';
        const hasProducts = this.products !== undefined && this.products !== null && this.products.length > 0;
        const hasStatus = this.status !== undefined && this.status !== null;

        if (!hasClientId && !hasProducts && !hasStatus) {
            throw new Error('Debe proporcionar al menos un campo para actualizar: clientId, products o status');
        }

        if (hasProducts && this.products) {
            this.products.forEach((product, index) => {
                if (!product.productId || product.productId.trim() === '') {
                    throw new Error(`El producto en posición ${index} no tiene un ID válido`);
                }
                if (!product.name || product.name.trim() === '') {
                    throw new Error(`El producto en posición ${index} no tiene un nombre válido`);
                }
                if (product.quantity <= 0) {
                    throw new Error(`La cantidad del producto en posición ${index} debe ser mayor a 0`);
                }
                if (product.price < 0) {
                    throw new Error(`El precio del producto en posición ${index} no puede ser negativo`);
                }
            });
        }
    }
}