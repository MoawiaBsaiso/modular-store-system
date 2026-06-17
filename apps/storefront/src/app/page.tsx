'use client'

import { useState, useEffect, useCallback } from 'react'
import { IntroLoader } from '@/components/layout/IntroLoader'
import { HeroSection } from '@/components/layout/HeroSection'
import { Navbar } from '@/components/layout/Navbar'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { CheckoutModal } from '@/features/checkout/components/CheckoutModal'
import { useLenis } from '@/lib/useLenis'

export default function StorePage() {
  const [introComplete, setIntroComplete]   = useState(false)
  const [isCartOpen, setIsCartOpen]         = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isDark, setIsDark]                 = useState(false)

  useLenis()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  return (
    <>
      {/* الـ Intro يُعرض دائماً أولاً */}
      <IntroLoader onComplete={handleIntroComplete} />

      {/* كل المحتوى مخفي حتى ينتهي الـ intro */}
      <div style={{
        opacity: introComplete ? 1 : 0,
        // لا نستخدم visibility:hidden عشان لا يأثر على الـ layout
        transition: 'none',
        pointerEvents: introComplete ? 'auto' : 'none',
      }}>
        {/* Navbar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 40,
        }}>
          <Navbar
            onCartOpen={() => setIsCartOpen(true)}
            onThemeToggle={() => setIsDark(d => !d)}
            isDark={isDark}
          />
        </div>

        {/* Hero — يبدأ أنيميشنه بعد انتهاء الـ intro */}
        <HeroSection ready={introComplete} />

        {/* Products */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px 100px',
        }}>
          <ProductGrid />
        </main>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  )
}
