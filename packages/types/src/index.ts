// 1. تعريف بنية بيانات المنتج (Product Schema)
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number; // السعر قبل الخصم (اختياري)
  images: string[];
  category: string;
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

// 2. تعريف بنية بيانات المستخدم وأدواره في النظام (User & Auth Roles)
export type UserRole = 'customer' | 'admin' | 'manager';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

// 3. تعريف حالة الطلبات (Order Status Flow)
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  createdAt: string;
}