import { useState } from 'react'
import type { ProductFormData } from '../types'

interface Props {
  onSubmit: (data: ProductFormData) => Promise<void>
}

// ─── Validation ────────────────────────────────────────────
// بدل alert() — نعرّف errors كـ object
// كل key هو اسم الحقل، والـ value هو رسالة الخطأ
type FormErrors = Partial<Record<keyof ProductFormData, string>>

function validate(data: typeof INITIAL_STATE): FormErrors {
  const errors: FormErrors = {}
  if (!data.title.trim()) errors.title = 'اسم المنتج مطلوب'
  if (!data.sku.trim()) errors.sku = 'رمز SKU مطلوب'
  if (!data.price || Number(data.price) <= 0) errors.price = 'أدخل سعراً صحيحاً'
  if (Number(data.stock) < 0) errors.stock = 'الكمية لا تكون سالبة'
  return errors
}

const INITIAL_STATE = {
  title: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  sku: '',
}

// ─── Component ─────────────────────────────────────────────
export function ProductForm({ onSubmit }: Props) {
  const [form, setForm] = useState(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const update = (key: keyof typeof INITIAL_STATE, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    // نمسح خطأ الحقل لما المستخدم يبدأ يكتب
    if (errors[key as keyof ProductFormData]) {
      setErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim() || 'عام',
        stock: Number(form.stock) || 0,
        sku: form.sku.trim(),
        // صورة افتراضية مؤقتاً — سنستبدلها بـ Convex Storage لاحقاً
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
      })
      setForm(INITIAL_STATE)
      setErrors({})
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 2500)
    } catch (err) {
      console.error('خطأ في إضافة المنتج:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      background: 'var(--salis-bg-base)',
      border: '1px solid var(--salis-border)',
      borderRadius: '16px',
      padding: '24px',
    }}>
      <h2 style={{
        fontSize: '16px',
        fontWeight: 700,
        color: 'var(--salis-text-primary)',
        margin: '0 0 20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--salis-border)',
      }}>
        إضافة منتج جديد
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        <Field label="اسم المنتج *" error={errors.title}>
          <input
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="مثال: قميص كتان بيج"
            style={inputStyle(!!errors.title)}
          />
        </Field>

        <Field label="رمز SKU *" error={errors.sku}>
          <input
            value={form.sku}
            onChange={e => update('sku', e.target.value)}
            placeholder="مثال: SHIRT-001"
            dir="ltr"
            style={inputStyle(!!errors.sku)}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Field label="السعر (₪) *" error={errors.price}>
            <input
              type="number"
              value={form.price}
              onChange={e => update('price', e.target.value)}
              placeholder="0"
              min="0"
              style={inputStyle(!!errors.price)}
            />
          </Field>
          <Field label="الكمية" error={errors.stock}>
            <input
              type="number"
              value={form.stock}
              onChange={e => update('stock', e.target.value)}
              placeholder="0"
              min="0"
              style={inputStyle(!!errors.stock)}
            />
          </Field>
        </div>

        <Field label="الفئة">
          <input
            value={form.category}
            onChange={e => update('category', e.target.value)}
            placeholder="مثال: ملابس، إلكترونيات..."
            style={inputStyle(false)}
          />
        </Field>

        <Field label="الوصف">
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="وصف تفصيلي عن المنتج..."
            rows={3}
            style={{
              ...inputStyle(false),
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </Field>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '4px',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            color: '#fff',
            background: isSuccess
              ? '#22C55E'
              : isLoading
              ? 'var(--salis-border)'
              : 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
            transition: 'background 0.3s ease',
          }}
        >
          {isSuccess ? '✓ تمت الإضافة' : isLoading ? 'جاري الحفظ...' : 'حفظ المنتج'}
        </button>

      </form>
    </div>
  )
}

// ─── Field wrapper ─────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '12px',
        fontWeight: 600,
        color: error ? '#EF4444' : 'var(--salis-text-secondary)',
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: '11px', color: '#EF4444', margin: 0 }}>{error}</p>
      )}
    </div>
  )
}

// ─── Input style helper ────────────────────────────────────
function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--salis-bg-surface)',
    border: `1px solid ${hasError ? '#EF4444' : 'var(--salis-border)'}`,
    borderRadius: '8px',
    fontSize: '13px',
    color: 'var(--salis-text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 150ms',
    boxSizing: 'border-box',
  }
}
