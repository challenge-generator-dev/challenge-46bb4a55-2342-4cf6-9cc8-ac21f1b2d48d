import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, deleteOrder } from './services/order.service';
import { Order, ApiError } from '@/shared/utils/api';
import { OrderCard } from './components/OrderCard';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import './OrderList.scss';

interface OrderListProps {
  onEditOrder: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ onEditOrder }) => {
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const itemsPerPage = 5;

  const { data: orders = [], error, isLoading } = useQuery<Order[], ApiError>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Error deleting order:', error);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' ? true : order.status === filterStatus
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (isLoading) {
    return <div className="order-list-loading">Cargando órdenes...</div>;
  }

  if (error) {
    return (
      <div className="order-list-error">
        Error al cargar órdenes: {error.message}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="order-list-container">
        <div className="order-list-header">
          <h2>Lista de Órdenes</h2>
          <div className="order-list-filter">
            <label htmlFor="status-filter">Filtrar por estado:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Order['status'] | 'all')}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="processing">En Proceso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        {paginatedOrders.length === 0 ? (
          <div className="order-list-empty">No hay órdenes disponibles</div>
        ) : (
          <>
            <div className="order-list-grid">
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onEdit={() => onEditOrder(order)}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="order-list-pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default OrderList;