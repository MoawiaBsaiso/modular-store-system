'use client'

import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import type { Product } from '@/types'

export function useProducts() {
  const products = useQuery(api.products.get) as Product[] | undefined
  return {
    products: products ?? [],
    isLoading: products === undefined,
    isEmpty: products !== undefined && products.length === 0,
  }
}
