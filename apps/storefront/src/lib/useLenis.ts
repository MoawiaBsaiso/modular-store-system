'use client'

import { useEffect } from 'react'

// useLenis — يهيّئ Lenis smooth scrolling على مستوى الصفحة كلها
// نستدعيه مرة واحدة في الـ layout أو الـ page الرئيسية
export function useLenis() {
  useEffect(() => {
    let lenis: InstanceType<typeof import('lenis').default> | null = null

    async function init() {
      const { default: Lenis } = await import('lenis')

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      })

      // ربط Lenis بـ GSAP ticker عشان يشتغلوا بنفس الـ frame rate
      async function connectToGsap() {
        const { gsap } = await import('gsap')
        gsap.ticker.add((time) => {
          lenis?.raf(time * 1000)
        })
        gsap.ticker.lagSmoothing(0)
      }

      connectToGsap()
    }

    init()

    return () => {
      lenis?.destroy()
    }
  }, [])
}
