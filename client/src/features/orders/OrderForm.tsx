import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, updateOrder } from './services/order.service';
import { CreateOrderDto, UpdateOrderDto, Order, ApiError } from '@/shared/utils/api';
import { createOrderSchema, updateOrderSchema } from '@/shared/utils/validation';
import './OrderForm.scss';

interface OrderFormProps {
  orderToEdit?: Order | null;
  onSuccess?: () => void;
}

type FormData = OrderFormProps['orderToEdit'] extends Order ? UpdateOrderDto : CreateOrderDto;

const OrderForm: React.FC<OrderFormProps> = ({ orderToEdit, onSuccess }) => {
  const queryClient = useQueryClient();
  const isEditing = !!orderToEdit;

  const { mutate, isPending, error } = useMutation<Order, ApiError, FormData>({
    mutationFn: (data) =>
      isEditing
        ? updateOrder(orderToEdit.id, data as UpdateOrderDto)
        : createOrder(data as CreateOrderDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (onSuccess) onSuccess();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(isEditing ? updateOrderSchema : createOrderSchema),
    mode: 'onChange',
    defaultValues: isEditing
      ? {
          customerId: orderToEdit.customerId,
          customerName: orderToEdit.customerName,
          products: orderToEdit.products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
          })),
          status: orderToEdit.status,
        }
      : {
          customerId: '',
          customerName: '',
          products: [{ name: '', quantity: 1, price: 0 }],
        },
  });

  const products = watch('products');

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate(data);
  };

  const addProduct = () => {
    setValue('products', [...products, { name: '', quantity: 1, price: 0 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setValue('products', newProducts);
    }
  };

  const updateProduct = (index: number, field: keyof Omit<Product, 'id'>, value: string | number) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setValue('products', newProducts);
  };

  const total = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);

  return (
    <div className="order-form-container">
      <h2>{isEditing ? 'Editar Orden' : 'Crear Nueva Orden'}</h2>

      {error && (
        <div className="order-form-error">
          Error: {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="order-form">
        <div className="order-form-group">
          <label htmlFor="customerId">ID del Cliente</label>
          <input
            id="customerId"
            {...register('customerId')}
            type="text"
            placeholder="Ingrese ID del cliente"
          />
          {errors.customerId && <span className="error-message">{errors.customerId.message}</span>}
        </div>

        <div className="order-form-group">
          <label htmlFor="customerName">Nombre del Cliente</label>
          <input
            id="customerName"
            {...register('customerName')}
            type="text"
            placeholder="Ingrese nombre del cliente"
          />
          {errors.customerName && <span className="error-message">{errors.customerName.message}</span>}
        </div>

        <div className="order-form-products">
          <h3>Productos</h3>
          {products.map((product, index) => (
            <div key={index} className="order-form-product">
              <div className="order-form-product-field">
                <label>Nombre</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                  placeholder="Nombre del producto"
                />
                {errors.products?.[index]?.name && (
                  <span className="error-message">{errors.products[index]?.name?.message}</span>
                )}
              </div>

              <div className="order-form-product-field">
                <label>Cantidad</label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => updateProduct(index, 'quantity', Number(e.target.value))}
                  min="1"
                />
                {errors.products?.[index]?.quantity && (
                  <span className="error-message">{errors.products[index]?.quantity?.message}</span>
                )}
              </div>

              <div className="order-form-product-field">
                <label>Precio</label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => updateProduct(index, 'price', Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
                {errors.products?.[index]?.price && (
                  <span className="error-message">{errors.products[index]?.price?.message}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="order-form-remove-product"
                disabled={products.length <= 1}
              >
                Eliminar
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addProduct}
            className="order-form-add-product"
          >
            Añadir Producto
          </button>
        </div>

        {isEditing && (
          <div className="order-form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              {...register('status')}
            >
              <option value="pending">Pendiente</option>
              <option value="processing">En Proceso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            {errors.status && <span className="error-message">{errors.status.message}</span>}
          </div>
        )}

        <div className="order-form-total">
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>

        <button
          type="submit"
          className="order-form-submit"
          disabled={!isValid || isPending}
        >
          {isPending ? 'Procesando...' : isEditing ? 'Actualizar Orden' : 'Crear Orden'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;