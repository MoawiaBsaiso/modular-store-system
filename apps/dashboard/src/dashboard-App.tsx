import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { ThemeToggle } from '@modular/ui'
import { ProductForm } from './components/ProductForm'
import { useProducts } from './hooks/useProducts'
import { useOrders } from './hooks/useOrders'
import type { Order, Product } from './types'

// بدل if/else في كل مكان — object mapping للحالات
const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: 'قيد المعالجة', bg: '#FEF9C3', color: '#854D0E' },
  processing: { label: 'قيد التجهيز',  bg: '#E0F2FE', color: '#075985' },
  shipped:    { label: 'تم الشحن',     bg: '#DCFCE7', color: '#166534' },
  delivered:  { label: 'تم التسليم',   bg: '#F0FDF4', color: '#14532D' },
  cancelled:  { label: 'ملغي',         bg: '#FEE2E2', color: '#991B1B' },
}

export default function App() {
  const { products, isLoading: pLoading, createProduct } = useProducts()
  const { orders,   isLoading: oLoading, updateOrderStatus, stats } = useOrders()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--salis-bg-base)',
      color: 'var(--salis-text-primary)',
      fontFamily: 'system-ui, sans-serif',
    }} dir="rtl">

      {/* ── غير مسجل ───────────────────────────────────── */}
      <Unauthenticated>
        <div style={{
          minHeight: '100vh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '40px',
            textAlign: 'center', maxWidth: '360px', width: '100%',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔐</div>
            <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>
              لوحة تحكم Salis
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 28px', lineHeight: 1.6 }}>
              هذه اللوحة محمية. يرجى تسجيل الدخول للمتابعة.
            </p>
            <SignInButton mode="redirect">
              <button style={{
                width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              }}>
                تسجيل الدخول
              </button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>

      {/* ── مسجل ───────────────────────────────────────── */}
      <Authenticated>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px' }}>

          {/* Header */}
          <header style={{
            padding: '20px 0', marginBottom: '28px',
            borderBottom: '1px solid var(--salis-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '28px', height: '28px',
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px' }}>S</span>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--salis-text-primary)' }}>
                  Salis Dashboard
                </div>
                <div style={{ fontSize: '11px', color: 'var(--salis-text-muted)' }}>
                  إدارة المنتجات والطلبات حياً
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ThemeToggle size="sm" />
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px', marginBottom: '28px',
          }}>
            {[
              { icon: '📦', label: 'إجمالي الطلبات', value: stats.total },
              { icon: '⏳', label: 'قيد المعالجة',   value: stats.pending },
              { icon: '🚚', label: 'تم الشحن',        value: stats.shipped },
              { icon: '💰', label: 'إجمالي الإيراد',  value: `₪${stats.revenue.toFixed(0)}` },
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--salis-bg-base)',
                border: '1px solid var(--salis-border)',
                borderRadius: '12px', padding: '16px',
              }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--salis-text-primary)', marginBottom: '4px' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--salis-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Products + Form */}
          <div style={{
            display: 'grid', gridTemplateColumns: '340px 1fr',
            gap: '20px', marginBottom: '24px', alignItems: 'start',
          }}>
            <ProductForm onSubmit={createProduct} />

            <div style={{
              background: 'var(--salis-bg-base)',
              border: '1px solid var(--salis-border)',
              borderRadius: '16px', overflow: 'hidden',
            }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--salis-border)' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--salis-text-primary)', margin: 0 }}>
                  المنتجات ({products.length})
                </h2>
              </div>
              {pLoading ? <Spinner /> : products.length === 0 ? (
                <Empty text="لا توجد منتجات — أضف أول منتج" />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'var(--salis-bg-surface)' }}>
                        {['المنتج', 'SKU', 'السعر', 'المخزون'].map(h => (
                          <th key={h} style={{
                            padding: '10px 16px', textAlign: 'right',
                            fontSize: '11px', fontWeight: 600,
                            color: 'var(--salis-text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p: Product) => (
                        <tr key={p._id} style={{ borderTop: '1px solid var(--salis-border)' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--salis-text-primary)' }}>
                            {p.title}
                          </td>
                          <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11px', color: 'var(--salis-text-muted)' }}>
                            {p.sku}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#FF6B6B' }}>
                            ₪{p.price}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              background: p.stock > 0 ? '#DCFCE7' : '#FEE2E2',
                              color: p.stock > 0 ? '#166534' : '#991B1B',
                              padding: '3px 10px', borderRadius: '99px',
                              fontSize: '11px', fontWeight: 600,
                            }}>
                              {p.stock} قطعة
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div style={{
            background: 'var(--salis-bg-base)',
            border: '1px solid var(--salis-border)',
            borderRadius: '16px', overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 20px', borderBottom: '1px solid var(--salis-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--salis-text-primary)', margin: 0 }}>
                الطلبات الواردة
              </h2>
              <span style={{
                fontSize: '11px', color: 'var(--salis-text-muted)',
                background: 'var(--salis-bg-surface)',
                padding: '4px 10px', borderRadius: '99px',
                border: '1px solid var(--salis-border)',
              }}>
                🔴 مباشر
              </span>
            </div>

            {oLoading ? <Spinner /> : orders.length === 0 ? (
              <Empty text="لا توجد طلبات حتى الآن — جرب الشراء من المتجر" />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'var(--salis-bg-surface)' }}>
                      {['الزبون', 'المنتجات', 'الإجمالي', 'الحالة', 'إجراء'].map(h => (
                        <th key={h} style={{
                          padding: '10px 16px', textAlign: 'right',
                          fontSize: '11px', fontWeight: 600,
                          color: 'var(--salis-text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: Order) => {
                      const s = STATUS[order.status] ?? STATUS.pending
                      return (
                        <tr key={order._id} style={{ borderTop: '1px solid var(--salis-border)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--salis-text-primary)' }}>
                              {order.customerName}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--salis-text-muted)', fontFamily: 'monospace' }}>
                              {order.customerPhone}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {order.items?.map((item, i) => (
                              <div key={i} style={{ fontSize: '12px', color: 'var(--salis-text-secondary)' }}>
                                <span style={{ fontWeight: 700, color: '#FF6B6B' }}>×{item.quantity}</span> {item.title}
                              </div>
                            ))}
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--salis-text-primary)' }}>
                            ₪{order.totalPrice}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              background: s.bg, color: s.color,
                              padding: '4px 10px', borderRadius: '99px',
                              fontSize: '11px', fontWeight: 600,
                            }}>
                              {s.label}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => updateOrderStatus(order._id, 'shipped')}
                                style={{
                                  padding: '7px 14px',
                                  background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                                  color: '#fff', border: 'none',
                                  borderRadius: '8px', fontSize: '12px',
                                  fontWeight: 600, cursor: 'pointer',
                                }}
                              >
                                شحن الآن
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </Authenticated>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '28px', height: '28px',
        border: '3px solid var(--salis-border)',
        borderTopColor: '#FF6B6B',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div style={{
      padding: '48px', textAlign: 'center',
      color: 'var(--salis-text-muted)', fontSize: '13px',
    }}>
      {text}
    </div>
  )
}
