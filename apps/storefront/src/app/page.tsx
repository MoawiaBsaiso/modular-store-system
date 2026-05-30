'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/layout/HeroSection'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { CheckoutModal } from '@/features/checkout/components/CheckoutModal'
import { useLenis } from '@/lib/useLenis'

export default function StorePage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // تفعيل Lenis smooth scrolling على مستوى الصفحة
  useLenis()

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

      {/* Hero مع GSAP entrance animations */}
      <HeroSection />

      {/* Products مع GSAP ScrollTrigger */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 100px',
      }}>
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
