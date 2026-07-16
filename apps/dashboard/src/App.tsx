import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { ThemeToggle } from '@modular/ui'
import { ProductForm } from './components/ProductForm'
import { useProducts } from './hooks/useProducts'
import { useOrders } from './hooks/useOrders'
import type { Order, Product } from './types'

// ─── Status Config ─────────────────────────────────────────
// بدل ما نكتب if/else في كل مكان — نعرّف object mapping
// هاد مثال على Data-driven UI — البيانات تتحكم بالشكل
const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: 'قيد المعالجة', bg: '#FEF9C3', color: '#854D0E' },
  processing: { label: 'قيد التجهيز',  bg: '#E0F2FE', color: '#075985' },
  shipped:    { label: 'تم الشحن',     bg: '#DCFCE7', color: '#166534' },
  delivered:  { label: 'تم التسليم',   bg: '#F0FDF4', color: '#14532D' },
  cancelled:  { label: 'ملغي',         bg: '#FEE2E2', color: '#991B1B' },
}

// ─── App ───────────────────────────────────────────────────
export default function App() {
  // نستخدم الـ hooks اللي بنينا بدل ما نكتب useQuery/useMutation مباشرة
  // هيك الـ App.tsx يبقى نظيف ومش فيه منطق Convex
  const { products, isLoading: productsLoading, createProduct } = useProducts()
  const { orders, isLoading: ordersLoading, updateOrderStatus, stats } = useOrders()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--salis-bg-base)',
      color: 'var(--salis-text-primary)',
      fontFamily: 'system-ui, sans-serif',
      transition: 'background 0.25s ease, color 0.25s ease',
    }} dir="rtl">

      {/* ── غير مسجل ── */}
      <Unauthenticated>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '380px',
            width: '100%',
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
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}>
                تسجيل الدخول
              </button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>

      {/* ── مسجل ── */}
      <Authenticated>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px' }}>

          {/* Header */}
          <header style={{
            padding: '20px 0',
            borderBottom: '1px solid var(--salis-border)',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <div style={{
                  width: '28px', height: '28px',
                  background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                  borderRadius: '7px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px' }}>S</span>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--salis-text-primary)' }}>
                  Salis Dashboard
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--salis-text-muted)', margin: 0 }}>
                إدارة المنتجات والطلبات حياً
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ThemeToggle size="sm" />
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '32px',
          }}>
            <StatCard label="إجمالي الطلبات" value={stats.total} icon="📦" />
            <StatCard label="قيد المعالجة" value={stats.pending} icon="⏳" />
            <StatCard label="تم الشحن" value={stats.shipped} icon="🚚" />
            <StatCard label="إجمالي الإيراد" value={`₪${stats.revenue.toFixed(0)}`} icon="💰" />
          </div>

          {/* Main Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '24px',
            marginBottom: '32px',
            alignItems: 'start',
          }}>
            {/* ProductForm */}
            <ProductForm onSubmit={createProduct} />

            {/* Products Table */}
            <div style={{
              background: 'var(--salis-bg-base)',
              border: '1px solid var(--salis-border)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--salis-border)' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--salis-text-primary)', margin: 0 }}>
                  المنتجات ({products.length})
                </h2>
              </div>
              {productsLoading ? (
                <LoadingSpinner />
              ) : products.length === 0 ? (
                <EmptyState text="لا توجد منتجات — أضف أول منتج" />
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

          {/* Orders Table */}
          <div style={{
            background: 'var(--salis-bg-base)',
            border: '1px solid var(--salis-border)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--salis-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--salis-text-primary)', margin: 0 }}>
                الطلبات الواردة
              </h2>
              {/* شرح: هاد بيتحدث تلقائياً كل مرة يجي طلب جديد من الـ storefront */}
              <span style={{
                fontSize: '11px', color: 'var(--salis-text-muted)',
                background: 'var(--salis-bg-surface)',
                padding: '4px 10px', borderRadius: '99px',
                border: '1px solid var(--salis-border)',
              }}>
                🔴 مباشر
              </span>
            </div>

            {ordersLoading ? (
              <LoadingSpinner />
            ) : orders.length === 0 ? (
              <EmptyState text="لا توجد طلبات حتى الآن" />
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
                      const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
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
                              background: statusCfg.bg,
                              color: statusCfg.color,
                              padding: '4px 10px', borderRadius: '99px',
                              fontSize: '11px', fontWeight: 600,
                            }}>
                              {statusCfg.label}
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

// ─── Helper Components ─────────────────────────────────────
function StatCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div style={{
      background: 'var(--salis-bg-base)',
      border: '1px solid var(--salis-border)',
      borderRadius: '12px',
      padding: '16px',
    }}>
      <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--salis-text-primary)', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--salis-text-muted)' }}>{label}</div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '28px', height: '28px',
        border: '3px solid var(--salis-border)',
        borderTopColor: '#FF6B6B',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{
      padding: '48px', textAlign: 'center',
      color: 'var(--salis-text-muted)', fontSize: '13px',
    }}>
      {text}
    </div>
  )
}
