'use client'

import { useState, useCallback } from 'react'
import { useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useCart } from '@/features/cart/hooks/useCart'
import type { Id } from '@convex/_generated/dataModel'

export function useCheckout() {
  const { cart, cartTotal, clearCart } = useCart()
  const placeOrder = useAction(api.orders.placeOrder)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitOrder = useCallback(async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('الرجاء إدخال الاسم ورقم الهاتف')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        totalPrice: cartTotal,
        items: cart.map(item => ({
          productId: item.id as Id<'products'>,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        loop: false,
      })
      setIsSuccess(true)
      clearCart()
      setTimeout(() => {
        setIsSuccess(false)
        setCustomerName('')
        setCustomerPhone('')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب')
    } finally {
      setIsLoading(false)
    }
  }, [cart, cartTotal, customerName, customerPhone, clearCart, placeOrder])

  const reset = useCallback(() => {
    setCustomerName('')
    setCustomerPhone('')
    setError(null)
    setIsSuccess(false)
  }, [])

  return {
    customerName, setCustomerName,
    customerPhone, setCustomerPhone,
    isLoading, isSuccess, error,
    submitOrder, reset,
  }
}
