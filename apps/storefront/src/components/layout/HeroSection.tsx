'use client'

import { useEffect, useRef } from 'react'

interface Props {
  ready: boolean
}

export function HeroSection({ ready }: Props) {
  const badgeRef    = useRef<HTMLParagraphElement>(null)
  const line1Ref    = useRef<HTMLDivElement>(null)
  const line2Ref    = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const sectionRef  = useRef<HTMLElement>(null)

  // نخفي كل شيء بـ CSS قبل ما GSAP يشتغل
  useEffect(() => {
    if (!sectionRef.current) return
    // نخفي فوراً بدون انتظار GSAP
    const els = [badgeRef.current, line1Ref.current, line2Ref.current, subtitleRef.current]
    els.forEach(el => {
      if (el) {
        el.style.opacity = '0'
        el.style.transform = 'translateY(28px)'
      }
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    let ctx: any = null

    async function animate() {
      const { gsap } = await import('gsap')

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

        tl.to(badgeRef.current, {
          opacity: 1, y: 0, duration: 0.55,
        }, 0.1)

        tl.to(line1Ref.current, {
          opacity: 1, y: 0, duration: 0.6,
        }, 0.28)

        tl.to(line2Ref.current, {
          opacity: 1, y: 0, duration: 0.6,
        }, 0.42)

        tl.to(subtitleRef.current, {
          opacity: 1, y: 0, duration: 0.5,
        }, 0.56)

      }, sectionRef)
    }

    animate()
    return () => ctx?.revert()
  }, [ready])

  return (
    <section
      ref={sectionRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '88px 24px 56px',
        textAlign: 'center',
      }}
    >
      <p ref={badgeRef} style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', fontWeight: 600, color: 'var(--coral-start)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        margin: '0 0 20px', background: '#FF6B6B12',
        padding: '6px 16px', borderRadius: '99px',
        border: '1px solid #FF6B6B28',
      }}>
        ✦ تسوق ببساطة
      </p>

      <h1 style={{
        fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)', fontWeight: 800,
        color: 'var(--text-primary)', lineHeight: 1.18,
        letterSpacing: '-0.04em', margin: '0 0 20px',
      }}>
        <div ref={line1Ref}>كل ما تحتاجه،</div>
        <div ref={line2Ref}>
          <span style={{
            background: 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>في مكان واحد</span>
        </div>
      </h1>

      <p ref={subtitleRef} style={{
        fontSize: '17px', color: 'var(--text-secondary)',
        maxWidth: '460px', margin: '0 auto', lineHeight: 1.75,
      }}>
        تصفح منتجاتنا، أضف ما يعجبك للسلة،<br />واستلم طلبك بسهولة.
      </p>
    </section>
  )
}
