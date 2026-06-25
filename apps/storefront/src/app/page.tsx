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

  // تطبيق الثيم على الـ html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  const handleThemeToggle = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  const handleCartOpen = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  return (
    <>
      {/* Intro Loader */}
      <IntroLoader onComplete={handleIntroComplete} />

      {/* Navbar — دايماً موجود في الـ DOM، مخفي قبل الـ intro */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 40,
        opacity: introComplete ? 1 : 0,
        pointerEvents: introComplete ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
      }}>
        <Navbar
          onCartOpen={handleCartOpen}
          onThemeToggle={handleThemeToggle}
          isDark={isDark}
        />
      </div>

      {/* المحتوى — مخفي قبل الـ intro */}
      <div style={{
        visibility: introComplete ? 'visible' : 'hidden',
        paddingTop: '64px',
      }}>
        <HeroSection ready={introComplete} />
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px 100px',
        }}>
          <ProductGrid />
        </main>
      </div>

      {/* Cart Drawer — دايماً خارج الـ visibility wrapper */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  )
}
