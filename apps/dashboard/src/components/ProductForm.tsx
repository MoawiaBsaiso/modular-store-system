import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { ImageUpload } from './ImageUpload'
import type { ProductFormData } from '../types'

interface Props {
  onSubmit: (data: ProductFormData) => Promise<void>
}

type FormErrors = Partial<Record<'title' | 'sku' | 'price' | 'stock', string>>

const EMPTY = { title: '', description: '', price: '', category: '', stock: '', sku: '' }

function validate(f: typeof EMPTY): FormErrors {
  const e: FormErrors = {}
  if (!f.title.trim())            e.title = 'اسم المنتج مطلوب'
  if (!f.sku.trim())              e.sku   = 'رمز SKU مطلوب'
  if (!f.price || +f.price <= 0) e.price = 'أدخل سعراً صحيحاً'
  if (+f.stock < 0)              e.stock = 'الكمية لا تكون سالبة'
  return e
}

const inp = (err: boolean): React.CSSProperties => ({
  width: '100%', padding: '10px 12px', boxSizing: 'border-box',
  background: 'var(--salis-bg-surface)',
  border: `1px solid ${err ? '#EF4444' : 'var(--salis-border)'}`,
  borderRadius: '8px', fontSize: '13px',
  color: 'var(--salis-text-primary)', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 150ms',
})

export function ProductForm({ onSubmit }: Props) {
  const [form, setForm]         = useState(EMPTY)
  const [errors, setErrors]     = useState<FormErrors>({})
  const [isLoading, setLoading] = useState(false)
  const [isSuccess, setSuccess] = useState(false)
  const [storageId, setStorageId] = useState<string | null>(null)

  // Resolve storageId to a public URL — skip if no storageId yet
  const imageUrl = useQuery(
    api.storage.getImageUrl,
    storageId ? { storageId } : 'skip'
  ) as string | null | undefined

  const set = (k: keyof typeof EMPTY, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: undefined }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      // Use the Convex Storage URL if available, otherwise a placeholder
      const images = imageUrl
        ? [imageUrl]
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500']

      await onSubmit({
        title:       form.title.trim(),
        description: form.description.trim(),
        price:       +form.price,
        category:    form.category.trim() || 'عام',
        stock:       +form.stock || 0,
        sku:         form.sku.trim(),
        images,
      })

      setForm(EMPTY)
      setStorageId(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2200)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'var(--salis-bg-base)',
      border: '1px solid var(--salis-border)',
      borderRadius: '16px', padding: '24px',
    }}>
      <h2 style={{
        fontSize: '15px', fontWeight: 700,
        color: 'var(--salis-text-primary)',
        margin: '0 0 20px', paddingBottom: '16px',
        borderBottom: '1px solid var(--salis-border)',
      }}>
        إضافة منتج جديد
      </h2>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Image Upload */}
        <ImageUpload onUpload={setStorageId} />

        {/* Title */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: errors.title ? '#EF4444' : 'var(--salis-text-secondary)' }}>
            اسم المنتج *
          </span>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="مثال: قميص كتان بيج" style={inp(!!errors.title)} />
          {errors.title && <span style={{ fontSize: '11px', color: '#EF4444' }}>{errors.title}</span>}
        </label>

        {/* SKU */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: errors.sku ? '#EF4444' : 'var(--salis-text-secondary)' }}>
            رمز SKU *
          </span>
          <input value={form.sku} onChange={e => set('sku', e.target.value)}
            placeholder="SHIRT-001" dir="ltr" style={inp(!!errors.sku)} />
          {errors.sku && <span style={{ fontSize: '11px', color: '#EF4444' }}>{errors.sku}</span>}
        </label>

        {/* Price + Stock */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: errors.price ? '#EF4444' : 'var(--salis-text-secondary)' }}>
              السعر (₪) *
            </span>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="0" min="0" style={inp(!!errors.price)} />
            {errors.price && <span style={{ fontSize: '11px', color: '#EF4444' }}>{errors.price}</span>}
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--salis-text-secondary)' }}>الكمية</span>
            <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)}
              placeholder="0" min="0" style={inp(false)} />
          </label>
        </div>

        {/* Category */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--salis-text-secondary)' }}>الفئة</span>
          <input value={form.category} onChange={e => set('category', e.target.value)}
            placeholder="ملابس، إلكترونيات..." style={inp(false)} />
        </label>

        {/* Description */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--salis-text-secondary)' }}>الوصف</span>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="وصف تفصيلي..." rows={3}
            style={{ ...inp(false), resize: 'vertical' }} />
        </label>

        <button type="submit" disabled={isLoading} style={{
          marginTop: '4px', padding: '12px', borderRadius: '10px',
          border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '14px', fontWeight: 700, color: '#fff',
          background: isSuccess ? '#22C55E'
            : isLoading ? 'var(--salis-border)'
            : 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
          transition: 'background 0.3s',
        }}>
          {isSuccess ? '✓ تمت الإضافة' : isLoading ? 'جاري الحفظ...' : 'حفظ المنتج'}
        </button>

      </form>
    </div>
  )
}
