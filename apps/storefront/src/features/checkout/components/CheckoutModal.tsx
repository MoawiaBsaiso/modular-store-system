'use client'

import { useCheckout } from '../hooks/useCheckout'
import { useCart } from '@/features/cart/hooks/useCart'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: Props) {
  const { cartCount, cartTotal } = useCart()
  const {
    customerName, setCustomerName,
    customerPhone, setCustomerPhone,
    isLoading, isSuccess, error,
    submitOrder,
  } = useCheckout()

  if (!isOpen) return null

  const handleClose = () => { if (!isLoading) onClose() }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      {/* Overlay */}
      <div onClick={handleClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(26,26,46,0.6)',
        backdropFilter: 'blur(6px)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        background: 'var(--bg-base)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        padding: '28px',
        boxShadow: '0 24px 80px rgba(26,26,46,0.2)',
      }}>
        {isSuccess ? (
          // حالة النجاح
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
              تم استلام طلبك!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              سنتواصل معك قريباً على رقم الهاتف المُدخل.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    إتمام الشراء
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    {cartCount} منتج · الإجمالي ₪{cartTotal.toFixed(2)}
                  </p>
                </div>
                <button onClick={handleClose} aria-label="إغلاق"
                  style={{
                    width: '30px', height: '30px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '16px',
                  }}>
                  ✕
                </button>
              </div>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="محمد أحمد"
                  disabled={isLoading}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px', color: 'var(--text-primary)',
                    outline: 'none', transition: 'border-color var(--duration-fast)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="059XXXXXXXX"
                  disabled={isLoading}
                  dir="ltr"
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px', color: 'var(--text-primary)',
                    outline: 'none', transition: 'border-color var(--duration-fast)',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              {error && (
                <p style={{
                  fontSize: '13px', color: 'var(--danger)',
                  background: '#EF444415',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  margin: 0,
                }}>
                  {error}
                </p>
              )}

              <button
                onClick={submitOrder}
                disabled={isLoading}
                style={{
                  marginTop: '4px',
                  width: '100%', padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '15px', fontWeight: 700, color: '#fff',
                  background: isLoading ? 'var(--border)' : 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
                  transition: 'opacity var(--duration-fast)',
                }}
              >
                {isLoading ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
