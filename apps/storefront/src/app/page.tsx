'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { CheckoutModal } from '@/features/checkout/components/CheckoutModal'

export default function StorePage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const handleCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <>
      <Navbar
        onCartOpen={() => setIsCartOpen(true)}
        onThemeToggle={() => setIsDark(d => !d)}
        isDark={isDark}
      />

      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 24px 48px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '13px', fontWeight: 600,
          color: 'var(--coral-start)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          margin: '0 0 16px',
        }}>تسوق ببساطة</p>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800,
          color: 'var(--text-primary)', lineHeight: 1.2,
          letterSpacing: '-0.03em', margin: '0 0 16px',
        }}>
          كل ما تحتاجه،<br />
          <span className="text-coral">في مكان واحد</span>
        </h1>

        <p style={{
          fontSize: '16px', color: 'var(--text-secondary)',
          maxWidth: '480px', margin: '0 auto', lineHeight: 1.7,
        }}>
          تصفح منتجاتنا، أضف ما يعجبك للسلة، واستلم طلبك بسهولة.
        </p>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
        <ProductGrid />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  )
}
