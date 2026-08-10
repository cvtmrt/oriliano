'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Hafif zengin metin editörü.
 *
 * Harici bir editör paketi (Tiptap vb.) yerine contenteditable + toolbar
 * tercih edildi: sıfır bağımlılık, mobilde sorunsuz ve panelin ihtiyacı olan
 * biçimlendirme (kalın, italik, başlık, liste, bağlantı) bununla karşılanıyor.
 * Gerçek değer gizli bir textarea'da tutulur, form onu gönderir.
 */
export default function RichText({
  name,
  defaultValue,
  onInput,
  placeholder,
  minHeight = 220,
}: {
  name: string
  defaultValue: string
  onInput?: (html: string) => void
  placeholder?: string
  minHeight?: number
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(defaultValue)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (editorRef.current && !ready) {
      editorRef.current.innerHTML = defaultValue || ''
      setReady(true)
    }
  }, [defaultValue, ready])

  function sync() {
    const html = editorRef.current?.innerHTML ?? ''
    setValue(html)
    onInput?.(html)
  }

  function exec(command: string, arg?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    sync()
  }

  function addLink() {
    const url = window.prompt('Bağlantı adresi (https://…)')
    if (!url) return
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('mailto:')) {
      window.alert('Adres http:// veya https:// ile başlamalı.')
      return
    }
    exec('createLink', url)
  }

  const tools: { label: string; title: string; run: () => void }[] = [
    { label: 'B', title: 'Kalın', run: () => exec('bold') },
    { label: 'I', title: 'İtalik', run: () => exec('italic') },
    { label: 'H3', title: 'Ara başlık', run: () => exec('formatBlock', 'h3') },
    { label: 'H4', title: 'Alt başlık', run: () => exec('formatBlock', 'h4') },
    { label: '¶', title: 'Paragraf', run: () => exec('formatBlock', 'p') },
    { label: '• Liste', title: 'Madde listesi', run: () => exec('insertUnorderedList') },
    { label: '1. Liste', title: 'Numaralı liste', run: () => exec('insertOrderedList') },
    { label: '🔗', title: 'Bağlantı ekle', run: addLink },
    { label: '⨯', title: 'Biçimi temizle', run: () => exec('removeFormat') },
  ]

  return (
    <div className="rounded border border-graphite-300 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-graphite-200 p-1.5">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.title}
            onClick={tool.run}
            className="min-h-[36px] min-w-[36px] rounded px-2 text-xs font-medium text-graphite-700 transition-colors hover:bg-graphite-100"
          >
            {tool.label}
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder || 'Zengin metin'}
        onInput={sync}
        onBlur={sync}
        // Yapıştırmada biçim taşımasın
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
          sync()
        }}
        className="prose-legal max-w-none px-4 py-3 text-sm focus:outline-none"
        style={{ minHeight }}
      />

      <textarea name={name} value={value} readOnly hidden />
    </div>
  )
}
