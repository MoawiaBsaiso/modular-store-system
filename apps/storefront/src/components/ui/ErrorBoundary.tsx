'use client'

import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

// ─── شرح Error Boundary ────────────────────────────────────
// Error Boundary هو مفهوم من React بيسمح لنا نمسك الأخطاء
// اللي بتصير أثناء الـ rendering وبدل ما تنهار الصفحة كاملة
// بنعرض UI بديل (fallback)
//
// لازم يكون Class Component — مش function component
// لأنه يستخدم lifecycle methods: componentDidCatch و getDerivedStateFromError
// اللي مش متاحة كـ hooks حتى الآن

interface Props {
  children: ReactNode
  // fallback اختياري — لو ما حددنا بنستخدم الـ default
  fallback?: ReactNode
  // اسم وصفي للـ boundary عشان نعرف وين صار الخطأ
  name?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // getDerivedStateFromError — بيشتغل لما يصير خطأ في أي component داخل الـ boundary
  // بيرجع state جديد عشان نعرض الـ fallback
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  // componentDidCatch — للـ logging، بنقدر نرسل الخطأ لـ Sentry أو أي خدمة
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary: ${this.props.name ?? 'unknown'}]`, error, info)
  }

  // reset — بنسمح للمستخدم يحاول مرة ثانية
  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // لو في fallback مخصص نستخدمه
      if (this.props.fallback) return this.props.fallback

      // الـ fallback الافتراضي — تصميم Salis
      return (
        <div style={{
          minHeight: '300px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '16px', textAlign: 'center',
          padding: '40px 24px',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-xl)',
          margin: '24px',
        }}>
          <p style={{ fontSize: '2.5rem', margin: 0 }}>⚠️</p>
          <div>
            <h3 style={{
              fontSize: '16px', fontWeight: 700,
              color: 'var(--text-primary)', margin: '0 0 6px',
            }}>
              حدث خطأ غير متوقع
            </h3>
            <p style={{
              fontSize: '13px', color: 'var(--text-secondary)',
              margin: 0, lineHeight: 1.6,
            }}>
              {this.state.error?.message ?? 'يرجى المحاولة مجدداً'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, var(--coral-start), var(--coral-end))',
              color: '#fff', border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            حاول مجدداً
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
