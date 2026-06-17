'use client'

import { useEffect, useRef } from 'react'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from './ProductCard'

export function ProductGrid() {
  const { products, isLoading, isEmpty } = useProducts()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!products.length) return
    let ctx: any = null

    async function animate() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const cards = gridRef.current?.querySelectorAll('.product-card')
        if (!cards?.length) return

        // نخفي من البداية
        gsap.set(cards, { opacity: 0, y: 44, scale: 0.96 })

        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 88%',
            once: true, // يشتغل مرة واحدة فقط
          },
        })
      }, gridRef)
    }

    animate()
    return () => ctx?.revert()
  }, [products])

  if (isLoading) return <ProductGridSkeleton />

  if (isEmpty) return (
    <div style={{
      textAlign: 'center', padding: '80px 24px',
      border: '1px dashed var(--border)',
      borderRadius: 'var(--radius-xl)',
    }}>
      <p style={{ fontSize: '2.5rem', margin: '0 0 16px' }}>🛍️</p>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0 }}>
        المتجر فارغ حالياً — تابعنا قريباً
      </p>
    </div>
  )

  return (
    <div ref={gridRef} style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '20px',
    }}>
      {products.map(product => (
        <div key={product._id} className="product-card">
          <ProductCard product={product} />
        </div>
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
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          animation: 'salis-pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.08}s`,
        }}>
          <div style={{ aspectRatio: '1', background: 'var(--bg-muted)' }} />
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ height: 11, background: 'var(--bg-muted)', borderRadius: 6, width: '55%' }} />
            <div style={{ height: 15, background: 'var(--bg-muted)', borderRadius: 6 }} />
            <div style={{ height: 15, background: 'var(--bg-muted)', borderRadius: 6, width: '75%' }} />
            <div style={{ height: 44, background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', marginTop: 8 }} />
          </div>
        </div>
      ))}
      <style>{`@keyframes salis-pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
    </div>
  )
}
