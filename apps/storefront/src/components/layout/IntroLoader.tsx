'use client'

import { useEffect, useRef } from 'react'

interface Props {
  onComplete: () => void
}

// ═══════════════════════════════════════════════════════════
// لتبديل بين الأنيميشنين:
//   'typography'  →  حروف pipe shuffle + بوابة مصعد
//   'fill'        →  نص يمتلئ + curtain للأعلى
// ═══════════════════════════════════════════════════════════
const ANIMATION_TYPE: 'typography' | 'fill' = 'typography'

// CHARS[0]=S, [1]=a, [2]=l, [3]=i, [4]=s
// currentSlots[slot] = charIndex
// نبدأ بـ sSali → 4 rotations → Salis
// sSali: slot0=s(4), slot1=S(0), slot2=a(1), slot3=l(2), slot4=i(3)
const INITIAL_SLOTS = [4, 0, 1, 2, 3]
const ROTATIONS     = 4
const CHARS         = ['S', 'a', 'l', 'i', 's']
const N             = 5
const SPREAD        = 72

function getX(slot: number) {
  return (slot - (N - 1) / 2) * SPREAD
}

export function IntroLoader({ onComplete }: Props) {
  const panelTopRef = useRef<HTMLDivElement>(null)
  const panelBotRef = useRef<HTMLDivElement>(null)
  const panelSingle = useRef<HTMLDivElement>(null)
  const stageRef    = useRef<HTMLDivElement>(null)
  const fillTextRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const taglineRef  = useRef<HTMLParagraphElement>(null)
  const wrapperRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let gsapCtx: any = null

    async function run() {
      const { gsap } = await import('gsap')

      gsapCtx = gsap.context(() => {

        if (ANIMATION_TYPE === 'typography') {
          if (!stageRef.current) return

          // ── بناء الحروف ──────────────────────────────────
          // letterEls[charIndex] = الـ span لذلك الحرف
          const letterEls: HTMLSpanElement[] = []

          CHARS.forEach((char) => {
            const el = document.createElement('span')
            el.textContent = char
            el.style.cssText = `
              position: absolute;
              font-size: clamp(56px, 11vw, 88px);
              font-weight: 900;
              color: #fff;
              line-height: 1;
              display: inline-block;
              will-change: transform;
            `
            stageRef.current!.appendChild(el)
            letterEls.push(el)
          })

          // نتتبع currentSlots[slot] = charIndex
          let currentSlots = [...INITIAL_SLOTS]

          // نضع كل حرف في موقعه الأولي مخفياً
          CHARS.forEach((_, charIdx) => {
            const slot = currentSlots.indexOf(charIdx)
            gsap.set(letterEls[charIdx], {
              x: getX(slot),
              y: 60,
              opacity: 0,
              scaleY: 0,
              transformOrigin: 'bottom center',
            })
          })

          gsap.set(taglineRef.current, { opacity: 0, y: 8 })

          const tl = gsap.timeline()

          // ١ — ظهور من المركز بـ elastic
          // نرتب الظهور من المركز للخارج: slots 2,1,3,0,4
          const appearBySlot = [2, 1, 3, 0, 4]
          appearBySlot.forEach((slot, i) => {
            const charIdx = currentSlots[slot]
            tl.to(letterEls[charIdx], {
              y: 0, opacity: 1, scaleY: 1,
              duration: 0.65,
              ease: 'elastic.out(1, 0.48)',
            }, i * 0.09)
          })

          tl.to({}, { duration: 0.3 })

          // ٢ — Pipe Shuffle: ROTATIONS مرات
          for (let step = 0; step < ROTATIONS; step++) {
            // الحرف في آخر slot يطير للأول
            const flyingCharIdx = currentSlots[N - 1]
            const flyingEl = letterEls[flyingCharIdx]

            // يطير للأعلى
            tl.to(flyingEl, {
              y: -52,
              duration: 0.14,
              ease: 'power2.out',
            }, '+=0.1')

            // يتحرك أفقياً لـ slot 0
            tl.to(flyingEl, {
              x: getX(0),
              duration: 0.3,
              ease: 'power3.inOut',
            }, '<+=0.02')

            // ينزل
            tl.to(flyingEl, {
              y: 0,
              duration: 0.14,
              ease: 'power2.in',
            }, '<+=0.18')

            // الحروف في slots 0..N-2 تتزحلق +1
            for (let slot = 0; slot < N - 1; slot++) {
              const charIdx = currentSlots[slot]
              tl.to(letterEls[charIdx], {
                x: getX(slot + 1),
                duration: 0.28,
                ease: 'power2.inOut',
              }, '<-=0.28')
            }

            // تحديث currentSlots
            const newSlots = new Array(N)
            newSlots[0] = currentSlots[N - 1]
            for (let slot = 0; slot < N - 1; slot++) {
              newSlots[slot + 1] = currentSlots[slot]
            }
            currentSlots = newSlots
          }

          tl.to({}, { duration: 0.35 })

          // ٣ — tagline
          tl.to(taglineRef.current, {
            opacity: 1, y: 0,
            duration: 0.4,
            ease: 'power3.out',
          })

          tl.to({}, { duration: 0.7 })

          // ٤ — fade out من المركز
          const fadeBySlot = [2, 1, 3, 0, 4]
          fadeBySlot.forEach((slot, i) => {
            const charIdx = currentSlots[slot]
            tl.to(letterEls[charIdx], {
              opacity: 0, y: -16,
              duration: 0.22,
              ease: 'power2.in',
            }, i === 0 ? '+=0' : '<+=0.04')
          })
          tl.to(taglineRef.current, { opacity: 0, duration: 0.2 }, '<')

          // ٥ — بوابة المصعد
          tl.to(panelTopRef.current, {
            y: '-100%',
            duration: 0.92,
            ease: 'power4.inOut',
          }, '+=0.05')

          tl.to(panelBotRef.current, {
            y: '100%',
            duration: 0.92,
            ease: 'power4.inOut',
          }, '<')

          tl.call(onComplete)
        }

        // ── OPTION B ────────────────────────────────────────
        if (ANIMATION_TYPE === 'fill') {
          gsap.set(fillTextRef.current,  { width: '0%' })
          gsap.set(progressRef.current,  { width: '0%' })
          gsap.set(taglineRef.current,   { opacity: 0, y: 8 })

          const tl = gsap.timeline()

          tl.to([fillTextRef.current, progressRef.current], {
            width: '100%', duration: 1.7, ease: 'power2.inOut',
          })
          tl.to(taglineRef.current, {
            opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
          }, '-=0.6')
          tl.to({}, { duration: 0.4 })
          tl.to(panelSingle.current, {
            y: '-100%', duration: 0.9, ease: 'power4.inOut',
          })
          tl.call(onComplete)
        }

      }, wrapperRef)
    }

    run()
    return () => gsapCtx?.revert()
  }, [onComplete])

  return (
    <div ref={wrapperRef} style={{ position: 'fixed', inset: 0, zIndex: 999 }}>

      {ANIMATION_TYPE === 'typography' && (
        <>
          <div ref={panelTopRef} style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', zIndex: 2,
          }} />
          <div ref={panelBotRef} style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
            background: 'linear-gradient(160deg, #FF8E53, #FF6B6B)', zIndex: 2,
          }} />
          <div ref={stageRef} style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3, pointerEvents: 'none',
          }} />
          <p ref={taglineRef} style={{
            position: 'absolute', top: '57%', left: 0, right: 0,
            textAlign: 'center', zIndex: 3, margin: 0,
            fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.18em', color: 'rgba(255,255,255,0.65)',
            textTransform: 'uppercase', pointerEvents: 'none',
          }}>
            تسوق ببساطة
          </p>
        </>
      )}

      {ANIMATION_TYPE === 'fill' && (
        <div ref={panelSingle} style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '20px',
        }}>
          <div style={{ position: 'relative' }}>
            <span style={{
              fontSize: 'clamp(64px, 12vw, 96px)', fontWeight: 900,
              color: 'rgba(255,255,255,0.2)', letterSpacing: '-3px',
              lineHeight: 1, userSelect: 'none',
            }}>Salis</span>
            <span ref={fillTextRef} style={{
              position: 'absolute', top: 0, left: 0,
              fontSize: 'clamp(64px, 12vw, 96px)', fontWeight: 900,
              color: '#fff', letterSpacing: '-3px', lineHeight: 1,
              overflow: 'hidden', whiteSpace: 'nowrap', width: '0%',
            }}>Salis</span>
          </div>
          <div style={{
            width: '100px', height: '2px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '99px', overflow: 'hidden',
          }}>
            <div ref={progressRef} style={{
              height: '100%', background: '#fff',
              width: '0%', borderRadius: '99px',
            }} />
          </div>
          <p ref={taglineRef} style={{
            fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.18em', color: 'rgba(255,255,255,0.65)',
            textTransform: 'uppercase', margin: 0,
          }}>تسوق ببساطة</p>
        </div>
      )}

    </div>
  )
}
