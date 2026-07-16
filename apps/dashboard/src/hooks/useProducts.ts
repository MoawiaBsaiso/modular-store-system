import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Product, ProductFormData } from '../types'

// ─── useProducts ───────────────────────────────────────────
// هاد الـ hook يعزل كل تعامل مع Convex المتعلق بالمنتجات
//
// ليش نعمل hook منفصل بدل ما نكتب useQuery مباشرة في الـ component؟
// ١. لو غيّرنا Convex أو استبدلناه بـ API ثاني — نعدل هون بس
// ٢. الـ component يبقى نظيف — بس UI بدون منطق
// ٣. سهل نعيد الاستخدام في أي مكان ثاني
export function useProducts() {
  // useQuery — بيعمل subscribe لـ Convex query
  // يعني لو تغير أي منتج في قاعدة البيانات، الـ UI بيتحدث تلقائياً
  // بدون ما تحتاج تعمل refresh أو polling
  const products = useQuery(api.products.get) as Product[] | undefined

  // useMutation — بترجع function تقدر تستدعيها لتعمل تعديل على قاعدة البيانات
  // مختلفة عن useQuery — ما بتشتغل تلقائياً، بتستدعيها أنت لما تحتاج
  const createProductMutation = useMutation(api.products.create)

  // هاد wrapper function عشان نضيف type safety ونخفي تفاصيل Convex
  const createProduct = async (data: ProductFormData) => {
    await createProductMutation(data)
  }

  return {
    products: products ?? [],
    isLoading: products === undefined,
    createProduct,
  }
}
