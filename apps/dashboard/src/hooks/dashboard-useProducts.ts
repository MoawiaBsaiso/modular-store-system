import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Product, ProductFormData } from '../types'

// useProducts — يعزل كل تعامل مع Convex المتعلق بالمنتجات
// useQuery بيعمل real-time subscription — أي تغيير في قاعدة البيانات
// يظهر فوراً في الـ UI بدون refresh
export function useProducts() {
  const products = useQuery(api.products.get) as Product[] | undefined
  const createMutation = useMutation(api.products.create)

  const createProduct = async (data: ProductFormData) => {
    await createMutation(data)
  }

  return {
    products: products ?? [],
    isLoading: products === undefined,
    createProduct,
  }
}
