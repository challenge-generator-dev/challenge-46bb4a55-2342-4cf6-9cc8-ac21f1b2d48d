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