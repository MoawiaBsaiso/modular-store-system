'use client'

import { useCart } from '../hooks/useCart'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, onCheckout }: Props) {
  const { cart, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart()

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} role="dialog" aria-modal="true" aria-label="سلة المشتريات">
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(26,26,46,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0, right: 0,
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-base)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              سلتك
            </span>
            <span style={{
              background: 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '99px',
              minWidth: '22px',
              textAlign: 'center',
            }}>
              {cartCount}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق السلة"
            style={{
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '18px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '2rem', margin: '0 0 12px' }}>🛒</p>
              <p style={{ fontSize: '14px', margin: 0 }}>سلتك فارغة</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              border: '1px solid var(--border)',
            }}>
              {/* صورة */}
              <div style={{
                width: '56px', height: '56px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                flexShrink: 0,
                background: 'var(--bg-muted)',
              }}>
                {item.image && (
                  <img src={item.image} alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              {/* معلومات */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '13px', fontWeight: 600,
                  color: 'var(--text-primary)', margin: '0 0 4px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {item.title}
                </p>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>
                  ₪{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* الكمية */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
              }}>
                <button onClick={() => updateQuantity(item.id, -1)}
                  style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '16px' }}>
                  −
                </button>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', minWidth: '20px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button onClick={() => updateQuantity(item.id, 1)}
                  style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '16px' }}>
                  +
                </button>
              </div>

              {/* حذف */}
              <button onClick={() => removeFromCart(item.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px', padding: '4px' }}>
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-surface)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>الإجمالي</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ₪{cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
                transition: 'opacity var(--duration-fast)',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              إتمام الشراء
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
