'use client'

import { useRef } from 'react'
import type { Product } from '@/types'
import { useCart } from '@/features/cart/hooks/useCart'

interface Props { product: Product }

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const cardRef = useRef<HTMLDivElement>(null)
  const inStock = product.stock > 0

  return (
    <div
      ref={cardRef}
      style={{
        background: 'var(--bg-base)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 12px 40px rgba(26,26,46,0.1)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* صورة المنتج */}
      <div style={{
        aspectRatio: '1',
        background: 'var(--bg-surface)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--duration-slow) var(--ease-out)',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', fontSize: '2.5rem',
          }}>
            🛍️
          </div>
        )}

        {/* شارة نفذت الكمية */}
        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(26,26,46,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              background: 'var(--danger)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: '99px',
            }}>نفذت الكمية</span>
          </div>
        )}

        {/* شارة الخصم */}
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: '99px',
          }}>
            خصم {Math.round((1 - product.price / product.compareAtPrice) * 100)}٪
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: '0 0 4px',
          }}>
            {product.category}
          </p>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.title}
          </h3>
        </div>

        {/* السعر */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₪{product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              textDecoration: 'line-through',
            }}>
              ₪{product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* زر الإضافة */}
        <button
          onClick={() => inStock && addToCart(product)}
          disabled={!inStock}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: inStock ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            background: inStock
              ? 'linear-gradient(135deg, var(--coral-start), var(--coral-end))'
              : 'var(--border)',
            transition: 'opacity var(--duration-fast)',
            opacity: inStock ? 1 : 0.5,
          }}
          onMouseEnter={e => { if (inStock) e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { if (inStock) e.currentTarget.style.opacity = '1' }}
        >
          {inStock ? 'أضف للسلة' : 'نفذت الكمية'}
        </button>
      </div>
    </div>
  )
}
