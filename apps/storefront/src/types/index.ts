// ─── Product ───────────────────────────────────────────────
export interface Product {
  _id: string
  _creationTime: number
  title: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  stock: number
  sku: string
}

// ─── Cart ──────────────────────────────────────────────────
export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  sku: string
  quantity: number
  maxStock: number
}

// ─── Order ─────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  title: string
  quantity: number
  price: number
}

export interface PlaceOrderArgs {
  customerName: string
  customerPhone: string
  totalPrice: number
  items: OrderItem[]
}
