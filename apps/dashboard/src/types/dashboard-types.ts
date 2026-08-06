export interface Product {
  _id: string
  _creationTime: number
  title: string
  description: string
  price: number
  category: string
  stock: number
  sku: string
  images: string[]
}

export interface ProductFormData {
  title: string
  description: string
  price: number
  category: string
  stock: number
  sku: string
  images: string[]
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  title: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  _creationTime: number
  customerName: string
  customerPhone: string
  totalPrice: number
  status: OrderStatus
  items: OrderItem[]
}
