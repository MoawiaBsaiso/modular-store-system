// ─── Product ───────────────────────────────────────────────
// هاد الـ interface بيعرّف شكل المنتج القادم من Convex
// كل حقل مطابق لما عرّفناه في convex/schema.ts
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

// ─── Product Form Data ─────────────────────────────────────
// هاد شكل البيانات اللي بترسلها الـ form لـ Convex
// لاحظ إننا ما بنعرّف _id و _creationTime — Convex بيولّدهم تلقائياً
export interface ProductFormData {
  title: string
  description: string
  price: number
  category: string
  stock: number
  sku: string
  images: string[]
}

// ─── Order ─────────────────────────────────────────────────
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
