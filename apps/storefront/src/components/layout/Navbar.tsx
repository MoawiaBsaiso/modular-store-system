'use client'

import { useCart } from '@/features/cart/hooks/useCart'

interface Props {
  onCartOpen: () => void
  onThemeToggle: () => void
  isDark: boolean
}

export function Navbar({ onCartOpen, onThemeToggle, isDark }: Props) {
  const { cartCount } = useCart()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(var(--bg-base-rgb, 255,251,247), 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>S</span>
          </div>
          <span style={{
            fontSize: '18px', fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.3px',
          }}>
            Salis
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            aria-label="تبديل المظهر"
            style={{
              width: '38px', height: '38px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: '17px',
              transition: 'background var(--duration-fast)',
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Cart button */}
          <button
            onClick={onCartOpen}
            aria-label={`السلة — ${cartCount} منتج`}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '14px', fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'background var(--duration-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-muted)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
          >
            🛒
            <span>السلة</span>
            {cartCount > 0 && (
              <span style={{
                background: 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
                color: '#fff',
                fontSize: '11px', fontWeight: 700,
                padding: '2px 7px', borderRadius: '99px',
                minWidth: '20px', textAlign: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
