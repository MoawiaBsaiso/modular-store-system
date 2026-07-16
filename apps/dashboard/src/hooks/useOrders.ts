import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import type { Order, OrderStatus } from '../types'

// ─── useOrders ─────────────────────────────────────────────
// يعزل كل تعامل مع Convex المتعلق بالطلبات
//
// شرح مهم عن Convex Reactivity:
// useQuery بيعمل real-time subscription — يعني لما زبون يطلب من الـ storefront،
// الطلب بيظهر هنا فوراً بدون أي تدخل منك. هاد الـ magic تاع Convex.
export function useOrders() {
  const orders = useQuery(api.orders.getAlldetails) as Order[] | undefined

  // useMutation لتحديث حالة الطلب
  const updateStatusMutation = useMutation(api.orders.updateStatus)

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // نحوّل الـ string لـ Convex Id type
      // هاد مهم عشان Convex يتحقق إن الـ ID صحيح قبل ما يوصل لقاعدة البيانات
      await updateStatusMutation({
        orderId: orderId as Id<'orders'>,
        status,
      })
    } catch (error) {
      console.error('خطأ في تحديث حالة الطلب:', error)
      throw error
    }
  }

  // إحصائيات مشتقة من البيانات
  // هاد مثال على computed values — بنحسبها من البيانات الموجودة
  // بدل ما نخزنها منفصلة في قاعدة البيانات
  const stats = {
    total: orders?.length ?? 0,
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
