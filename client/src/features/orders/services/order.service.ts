import {
  fetchOrders as apiFetchOrders,
  createOrder as apiCreateOrder,
  updateOrder as apiUpdateOrder,
  deleteOrder as apiDeleteOrder,
  getOrder as apiGetOrder,
  type Order,
  type CreateOrderDto,
  type UpdateOrderDto,
} from '@/shared/utils/api';

const API_BASE_URL = 'http://localhost:3000';

export const orderService = {
  async fetchOrders(): Promise<Order[]> {
    const response = await apiFetchOrders();
    return response.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await apiGetOrder(id);
    return response.data;
  },

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const response = await apiCreateOrder(data);
    return response.data;
  },

  async updateOrder(id: string, data: UpdateOrderDto): Promise<Order> {
    const response = await apiUpdateOrder(id, data);
    return response.data;
  },

  async deleteOrder(id: string): Promise<void> {
    await apiDeleteOrder(id);
  },
};

// Reexportar funciones para otros módulos que las importan directamente
export const fetchOrders = apiFetchOrders;
export const createOrder = apiCreateOrder;
export const updateOrder = apiUpdateOrder;
export const deleteOrder = apiDeleteOrder;