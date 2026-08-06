import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import type { Order, OrderStatus } from '../types'

// useOrders — يعزل كل تعامل مع Convex المتعلق بالطلبات
// الـ stats مشتقة من البيانات الموجودة — computed values
// بدل ما نخزنها منفصلة في قاعدة البيانات
export function useOrders() {
  const orders = useQuery(api.orders.getAlldetails) as Order[] | undefined
  const updateMutation = useMutation(api.orders.updateStatus)

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateMutation({
      orderId: orderId as Id<'orders'>,
      status,
    })
  }

  const stats = {
    total:   orders?.length ?? 0,
    pending: orders?.filter(o => o.status === 'pending').length ?? 0,
    shipped: orders?.filter(o => o.status === 'shipped').length ?? 0,
    revenue: orders?.reduce((sum, o) => sum + o.totalPrice, 0) ?? 0,
  }

  return {
    orders: orders ?? [],
    isLoading: orders === undefined,
    updateOrderStatus,
    stats,
  }
}
