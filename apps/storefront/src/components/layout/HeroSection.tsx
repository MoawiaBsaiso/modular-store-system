'use client'

import { useEffect, useRef } from 'react'

// HeroSection — أنيميشن دخول بـ GSAP
// كل عنصر يدخل بـ stagger من الأسفل للأعلى
export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLParagraphElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let ctx: any = null

    async function animate() {
      const { gsap } = await import('gsap')

      // نحدد السياق عشان نقدر نـ cleanup بسهولة
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: {
            duration: 0.8,
            ease: 'power3.out',
          },
        })

        // نبدأ من الحالة المخفية
        gsap.set([badgeRef.current, headingRef.current, subtitleRef.current], {
          opacity: 0,
          y: 30,
        })

        // Stagger — كل عنصر يتأخر 0.15 ثانية عن اللي قبله
        tl.to(badgeRef.current, { opacity: 1, y: 0 })
          .to(headingRef.current, { opacity: 1, y: 0 }, '-=0.5')
          .to(subtitleRef.current, { opacity: 1, y: 0 }, '-=0.5')
      }, containerRef)
    }

    animate()

    return () => ctx?.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px 56px',
        textAlign: 'center',
      }}
    >
      {/* Badge */}
      <p
        ref={badgeRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--coral-start)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          margin: '0 0 20px',
          background: '#FF6B6B12',
          padding: '6px 14px',
          borderRadius: '99px',
          border: '1px solid #FF6B6B22',
        }}
      >
        ✦ تسوق ببساطة
      </p>

      {/* Heading */}
      <h1
        ref={headingRef}
        style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.04em',
          margin: '0 0 20px',
        }}
      >
        كل ما تحتاجه،{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          في مكان واحد
        </span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        style={{
          fontSize: '17px',
          color: 'var(--text-secondary)',
          maxWidth: '460px',
          margin: '0 auto',
          lineHeight: 1.75,
        }}
      >
        تصفح منتجاتنا، أضف ما يعجبك للسلة،
        <br />
        واستلم طلبك بسهولة.
      </p>
    </section>
  )
}
