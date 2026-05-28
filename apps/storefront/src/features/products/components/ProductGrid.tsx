'use client'

import { useProducts } from '../hooks/useProducts'
import { ProductCard } from './ProductCard'

export function ProductGrid() {
  const { products, isLoading, isEmpty } = useProducts()

  if (isLoading) return <ProductGridSkeleton />

  if (isEmpty) return (
    <div style={{
      textAlign: 'center',
      padding: '80px 24px',
      border: '1px dashed var(--border)',
      borderRadius: 'var(--radius-xl)',
    }}>
      <p style={{ fontSize: '2rem', margin: '0 0 12px' }}>🛍️</p>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0 }}>
        المتجر فارغ حالياً — تابعنا قريباً
      </p>
    </div>
  )

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '20px',
    }}>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '20px',
    }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.1}s`,
        }}>
          <div style={{ aspectRatio: '1', background: 'var(--bg-muted)' }} />
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ height: 12, background: 'var(--bg-muted)', borderRadius: 6, width: '60%' }} />
            <div style={{ height: 16, background: 'var(--bg-muted)', borderRadius: 6 }} />
            <div style={{ height: 16, background: 'var(--bg-muted)', borderRadius: 6, width: '80%' }} />
            <div style={{ height: 44, background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', marginTop: 8 }} />
          </div>
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  )
}
