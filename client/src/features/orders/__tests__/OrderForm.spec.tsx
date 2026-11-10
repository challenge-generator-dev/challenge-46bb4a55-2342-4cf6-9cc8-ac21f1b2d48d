import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrderForm from '../OrderForm';
import { createOrder, updateOrder } from '../services/order.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../services/order.service');

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('OrderForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create order form by default', () => {
    render(<OrderForm />, { wrapper: Wrapper });

    expect(screen.getByText('Crear Nueva Orden')).toBeInTheDocument();
    expect(screen.getByLabelText('ID del Cliente')).toHaveValue('');
    expect(screen.getByLabelText('Nombre del Cliente')).toHaveValue('');
    expect(screen.getByText('Añadir Producto')).toBeInTheDocument();
  });

  it('renders edit order form when orderToEdit is provided', () => {
    const mockOrder = {
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe',
      products: [
        { id: 'p1', name: 'Product 1', quantity: 2, price: 10 },
        { id: 'p2', name: 'Product 2', quantity: 1, price: 20 },
      ],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      status: 'pending',
      total: 40,
    };

    render(<OrderForm orderToEdit={mockOrder} />, { wrapper: Wrapper });

    expect(screen.getByText('Editar Orden')).toBeInTheDocument();
    expect(screen.getByLabelText('ID del Cliente')).toHaveValue('cust123');
    expect(screen.getByLabelText('Nombre del Cliente')).toHaveValue('John Doe');
    expect(screen.getByDisplayValue('Product 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<OrderForm />, { wrapper: Wrapper });

    fireEvent.click(screen.getByText('Crear Orden'));

    await waitFor(() => {
      expect(screen.getByText('ID del cliente es requerido')).toBeInTheDocument();
      expect(screen.getByText('Nombre del cliente es requerido')).toBeInTheDocument();
      expect(screen.getByText('Nombre del producto es requerido')).toBeInTheDocument();
    });
  });

  it('validates product quantity and price', async () => {
    render(<OrderForm />, { wrapper: Wrapper });

    const nameInput = screen.getByPlaceholderText('Nombre del producto');
    const quantityInput = screen.getAllByLabelText('Cantidad')[0];
    const priceInput = screen.getAllByLabelText('Precio')[0];
    const submitButton = screen.getByText('Crear Orden');

    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(quantityInput, { target: { value: '0' } });
    fireEvent.change(priceInput, { target: { value: '-1' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La cantidad debe ser mayor que 0')).toBeInTheDocument();
      expect(screen.getByText('El precio debe ser mayor que 0')).toBeInTheDocument();
    });
  });

  it('adds and removes products', async () => {
    render(<OrderForm />, { wrapper: Wrapper });

    expect(screen.getAllByLabelText('Nombre')).toHaveLength(1);

    fireEvent.click(screen.getByText('Añadir Producto'));
    expect(screen.getAllByLabelText('Nombre')).toHaveLength(2);

    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    expect(screen.getAllByLabelText('Nombre')).toHaveLength(1);
  });

  it('submits create order form', async () => {
    const mockCreate = vi.mocked(createOrder).mockResolvedValue({
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe',
      products: [{ id: 'p1', name: 'Product 1', quantity: 2, price: 10 }],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      status: 'pending',
      total: 20,
    });

    render(<OrderForm />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText('ID del Cliente'), { target: { value: 'cust123' } });
    fireEvent.change(screen.getByLabelText('Nombre del Cliente'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Nombre del producto'), { target: { value: 'Product 1' } });
    fireEvent.change(screen.getAllByLabelText('Cantidad')[0], { target: { value: '2' } });
    fireEvent.change(screen.getAllByLabelText('Precio')[0], { target: { value: '10' } });

    fireEvent.click(screen.getByText('Crear Orden'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        customerId: 'cust123',
        customerName: 'John Doe',
        products: [{ name: 'Product 1', quantity: 2, price: 10 }],
      });
    });
  });

  it('submits update order form', async () => {
    const mockUpdate = vi.mocked(updateOrder).mockResolvedValue({
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe Updated',
      products: [{ id: 'p1', name: 'Product 1 Updated', quantity: 3, price: 15 }],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-02',
      status: 'processing',
      total: 45,
    });

    const mockOrder = {
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe',
      products: [{ id: 'p1', name: 'Product 1', quantity: 2, price: 10 }],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      status: 'pending',
      total: 20,
    };

    render(<OrderForm orderToEdit={mockOrder} />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText('Nombre del Cliente'), { target: { value: 'John Doe Updated' } });
    fireEvent.change(screen.getByDisplayValue('Product 1'), { target: { value: 'Product 1 Updated' } });
    fireEvent.change(screen.getAllByLabelText('Cantidad')[0], { target: { value: '3' } });
    fireEvent.change(screen.getAllByLabelText('Precio')[0], { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'processing' } });

    fireEvent.click(screen.getByText('Actualizar Orden'));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith('1', {
        customerName: 'John Doe Updated',
        products: [{ name: 'Product 1 Updated', quantity: 3, price: 15 }],
        status: 'processing',
      });
    });
  });

  it('calls onSuccess callback after successful submission', async () => {
    const mockOnSuccess = vi.fn();
    vi.mocked(createOrder).mockResolvedValue({
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe',
      products: [{ id: 'p1', name: 'Product 1', quantity: 2, price: 10 }],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      status: 'pending',
      total: 20,
    });

    render(<OrderForm onSuccess={mockOnSuccess} />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText('ID del Cliente'), { target: { value: 'cust123' } });
    fireEvent.change(screen.getByLabelText('Nombre del Cliente'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Nombre del producto'), { target: { value: 'Product 1' } });
    fireEvent.change(screen.getAllByLabelText('Cantidad')[0], { target: { value: '2' } });
    fireEvent.change(screen.getAllByLabelText('Precio')[0], { target: { value: '10' } });

    fireEvent.click(screen.getByText('Crear Orden'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});