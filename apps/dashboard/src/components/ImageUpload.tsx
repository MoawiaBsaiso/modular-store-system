import { useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

interface Props {
  onUpload: (url: string) => void
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

export function ImageUpload({ onUpload }: Props) {
  const [state, setState]     = useState<UploadState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB')
      return
    }

    setError(null)
    setState('uploading')

    // Show local preview immediately while uploading
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    try {
      // Step 1: get a short-lived upload URL from Convex
      const uploadUrl = await generateUploadUrl()

      // Step 2: PUT the file directly to Convex Storage
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!res.ok) throw new Error('Upload failed')

      // Step 3: extract the storageId from the response
      const { storageId } = await res.json()

      // Step 4: get the permanent public URL
      // We construct it directly since getUrl is a query
      // The storageId is passed up so the form can store it
      onUpload(storageId)
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setState('error')
      setPreview(null)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--salis-text-secondary)' }}>
        صورة المنتج
      </span>

      <div
        onClick={() => state !== 'uploading' && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: `2px dashed ${state === 'done' ? '#22C55E' : 'var(--salis-border)'}`,
          borderRadius: '10px',
          padding: preview ? '0' : '24px',
          textAlign: 'center',
          cursor: state === 'uploading' ? 'wait' : 'pointer',
          overflow: 'hidden',
          transition: 'border-color 200ms',
          background: 'var(--salis-bg-surface)',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div>
            <p style={{ fontSize: '24px', margin: '0 0 6px' }}>
              {state === 'uploading' ? '⏳' : '📷'}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--salis-text-secondary)', margin: 0 }}>
              {state === 'uploading'
                ? 'جاري الرفع...'
                : 'اضغط أو اسحب صورة هنا'}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--salis-text-muted)', margin: '4px 0 0' }}>
              PNG, JPG حتى 5MB
            </p>
          </div>
        )}
      </div>

      {state === 'done' && (
        <p style={{ fontSize: '12px', color: '#22C55E', margin: 0 }}>
          ✓ تم رفع الصورة بنجاح
        </p>
      )}

      {error && (
        <p style={{ fontSize: '12px', color: '#EF4444', margin: 0 }}>{error}</p>
      )}

      {preview && state !== 'uploading' && (
        <button
          type="button"
          onClick={() => {
            setPreview(null)
            setState('idle')
            setError(null)
            if (inputRef.current) inputRef.current.value = ''
          }}
          style={{
            fontSize: '12px', color: 'var(--salis-text-muted)',
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline', padding: 0, textAlign: 'right',
          }}
        >
          تغيير الصورة
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
