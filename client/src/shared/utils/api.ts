import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 401:
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acceso denegado');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
      }
      
      return Promise.reject<ApiError>({
        message: data?.message || error.message || 'Error desconocido',
        status,
        code: data?.code,
      });
    } else if (error.request) {
      return Promise.reject<ApiError>({
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        status: 0,
        code: 'NETWORK_ERROR',
      });
    } else {
      return Promise.reject<ApiError>({
        message: error.message || 'Error al procesar la solicitud',
        status: 0,
        code: 'UNKNOWN_ERROR',
      });
    }
  }
);

export async function fetchOrders(): Promise<ApiResponse<Order[]>> {
  const response = await apiClient.get<Order[]>('/orders');
  return {
    data: response.data,
    status: response.status,
  };
}

export async function createOrder(order: CreateOrderDto): Promise<ApiResponse<Order>> {
  const response = await apiClient.post<Order>('/orders', order);
  return {
    data: response.data,
    status: response.status,
    message: 'Orden creada exitosamente',
  };
}

export async function updateOrder(id: string, order: UpdateOrderDto): Promise<ApiResponse<Order>> {
  const response = await apiClient.put<Order>(`/orders/${id}`, order);
  return {
    data: response.data,
    status: response.status,
    message: 'Orden actualizada exitosamente',
  };
}

export async function deleteOrder(id: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete(`/orders/${id}`);
  return {
    data: undefined,
    status: response.status,
    message: 'Orden eliminada exitosamente',
  };
}

export async function getOrder(id: string): Promise<ApiResponse<Order>> {
  const response = await apiClient.get<Order>(`/orders/${id}`);
  return {
    data: response.data,
    status: response.status,
  };
}

export { apiClient };

// Exportar 'api' como alias de apiClient para compatibilidad
export const api = apiClient;

// Tipos complementarios para las operaciones de API
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  customerId: string;
  customerName: string;
  products: Omit<Product, 'id'>[];
}

export interface UpdateOrderDto {
  customerId?: string;
  customerName?: string;
  products?: Omit<Product, 'id'>[];
  status?: Order['status'];
}