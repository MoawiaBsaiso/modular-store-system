'use client'

import { useRef, useState, useCallback } from 'react'
import type { Product } from '@/types'
import { useCart } from '@/features/cart/hooks/useCart'

interface Props { product: Product }

// حالات زر السلة
type BtnState = 'idle' | 'adding' | 'added'

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const [btnState, setBtnState] = useState<BtnState>('idle')
  const [isHovered, setIsHovered] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const inStock = product.stock > 0

  // Micro-interaction: زر يتقلص → ✓ → يرجع
  const handleAddToCart = useCallback(async () => {
    if (!inStock || btnState !== 'idle') return

    setBtnState('adding')

    // استيراد GSAP ديناميكياً
    const { gsap } = await import('gsap')
    const btn = btnRef.current
    if (!btn) return

    const tl = gsap.timeline()

    // يتقلص للمنتصف
    tl.to(btn, {
      scaleX: 0.88,
      scaleY: 0.92,
      duration: 0.12,
      ease: 'power2.in',
    })

    // bounce للأعلى
    tl.to(btn, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.35,
      ease: 'elastic.out(1, 0.5)',
      onComplete: () => {
        addToCart(product)
        setBtnState('added')
        // يرجع لـ idle بعد ثانيتين
        setTimeout(() => setBtnState('idle'), 1800)
      },
    })
  }, [inStock, btnState, product, addToCart])

  const btnLabel =
    !inStock ? 'نفذت الكمية'
    : btnState === 'adding' ? '...'
    : btnState === 'added' ? '✓ تمت الإضافة'
    : 'أضف للسلة'

  const btnBg =
    !inStock ? 'var(--border)'
    : btnState === 'added' ? 'var(--success)'
    : 'linear-gradient(135deg, var(--coral-start), var(--coral-end))'

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'var(--bg-base)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 16px 48px rgba(26,26,46,0.12)' : 'none',
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
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
              width: '100%', height: '100%', objectFit: 'cover',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', fontSize: '2.5rem',
          }}>🛍️</div>
        )}

        {/* Hover Overlay — CTA يصعد من الأسفل */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(26,26,46,0.38)',
          backdropFilter: isHovered ? 'blur(2px)' : 'blur(0px)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease, backdrop-filter 0.3s ease',
          display: 'flex', alignItems: 'flex-end',
          padding: '12px',
        }}>
          <div style={{
            width: '100%',
            transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
            opacity: isHovered ? 1 : 0,
            transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
            transitionDelay: isHovered ? '0.05s' : '0s',
          }}>
            <span style={{
              display: 'block',
              background: '#fff',
              color: '#1A1A2E',
              textAlign: 'center',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 700,
            }}>
              عرض سريع
            </span>
          </div>
        </div>

        {/* شارة نفذت الكمية */}
        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(26,26,46,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              background: 'var(--danger)', color: '#fff',
              fontSize: '12px', fontWeight: 600,
              padding: '4px 12px', borderRadius: '99px',
            }}>نفذت الكمية</span>
          </div>
        )}

        {/* شارة الخصم */}
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
            color: '#fff', fontSize: '11px', fontWeight: 600,
            padding: '3px 10px', borderRadius: '99px',
          }}>
            خصم {Math.round((1 - product.price / product.compareAtPrice) * 100)}٪
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div style={{
        padding: '16px', flex: 1,
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        <p style={{
          fontSize: '11px', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0,
        }}>
          {product.category}
        </p>

        <h3 style={{
          fontSize: '15px', fontWeight: 600,
          color: 'var(--text-primary)', margin: 0,
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.title}
        </h3>

        {/* السعر */}
        <div style={{
          display: 'flex', alignItems: 'baseline',
          gap: '8px', marginTop: 'auto',
        }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₪{product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span style={{
              fontSize: '13px', color: 'var(--text-muted)',
              textDecoration: 'line-through',
            }}>
              ₪{product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* زر الإضافة مع Micro-interaction */}
        <button
          ref={btnRef}
          onClick={handleAddToCart}
          disabled={!inStock || btnState === 'adding'}
          style={{
            marginTop: '8px', width: '100%', padding: '12px',
            borderRadius: 'var(--radius-md)', border: 'none',
            cursor: inStock && btnState === 'idle' ? 'pointer' : 'default',
            fontSize: '14px', fontWeight: 600, color: '#fff',
            background: btnBg,
            transition: 'background 0.3s ease, opacity 0.15s',
            opacity: !inStock ? 0.5 : 1,
            transformOrigin: 'center',
          }}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  )
}
