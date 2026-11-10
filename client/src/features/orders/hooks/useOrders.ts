import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import type { Order, CreateOrderDto, UpdateOrderDto } from '../../../shared/utils/api';

const QUERY_KEYS = {
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
};

export function useOrders() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: () => orderService.fetchOrders(),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) =>
      orderService.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.order(id) });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,
    createOrder: createOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate,
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
    createError: createOrderMutation.error,
    updateError: updateOrderMutation.error,
    deleteError: deleteOrderMutation.error,
    createSuccess: createOrderMutation.isSuccess,
    updateSuccess: updateOrderMutation.isSuccess,
    deleteSuccess: deleteOrderMutation.isSuccess,
  };
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.order(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
}