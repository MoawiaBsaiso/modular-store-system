'use client'

import { useState, useEffect, useCallback } from 'react'
import { IntroLoader } from '@/components/layout/IntroLoader'
import { HeroSection } from '@/components/layout/HeroSection'
import { Navbar } from '@/components/layout/Navbar'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { CheckoutModal } from '@/features/checkout/components/CheckoutModal'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useLenis } from '@/lib/useLenis'

const INTRO_KEY = 'salis_intro_shown'

export default function StorePage() {
  const [mounted, setMounted]             = useState(false)
  const [introComplete, setIntroComplete] = useState(false)
  const [isCartOpen, setIsCartOpen]       = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isDark, setIsDark]               = useState(false)

  useLenis()

  useEffect(() => {
    // After hydration, check if intro was already shown
    const alreadyShown = sessionStorage.getItem(INTRO_KEY) === 'true'
    setIntroComplete(alreadyShown)
    setMounted(true)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, 'true')
    setIntroComplete(true)
  }, [])

  const handleThemeToggle = useCallback(() => setIsDark(p => !p), [])
  const handleCartOpen    = useCallback(() => setIsCartOpen(true), [])

  // Render nothing until we know whether to show intro or not
  // This prevents the flash of intro on returning visits
  if (!mounted) return null

  return (
    <>
      {!introComplete && <IntroLoader onComplete={handleIntroComplete} />}

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
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

      <div style={{
        visibility: introComplete ? 'visible' : 'hidden',
        paddingTop: '64px',
      }}>
        <HeroSection ready={introComplete} />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 100px' }}>
          <ErrorBoundary name="ProductGrid">
            <ProductGrid />
          </ErrorBoundary>
        </main>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true) }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  )
}
