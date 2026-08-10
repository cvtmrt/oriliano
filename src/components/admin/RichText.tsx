'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Hafif zengin metin editörü.
 *
 * Harici bir editör paketi (Tiptap vb.) yerine contenteditable + toolbar
 * tercih edildi: sıfır bağımlılık, mobilde sorunsuz ve panelin ihtiyacı olan
 * biçimlendirme (kalın, italik, başlık, liste, bağlantı) bununla karşılanıyor.
 * Gerçek değer gizli bir textarea'da tutulur, form onu gönderir.
 *
 * İKİ AYRI GERİ ÇAĞRI var ve aradaki fark önemli:
 *
 *   onChange   — içerik her senkronlandığında (blur dâhil) çalışır.
 *   onUserEdit — YALNIZCA kullanıcı gerçekten yazdığında/biçimlendirdiğinde.
 *
 * İngilizce alanın "elle düzenlendi" kilidi `onUserEdit`e bağlı. Blur'da da
 * tetiklenseydi, alana sadece tıklayıp çıkmak bile alanı kilitlerdi: tarayıcı
 * innerHTML'i normalleştirdiği için (`<br />` → `<br>` gibi) metin
 * değişmemiş olsa da farklı görünür.
 */
export default function RichText({
  name,
  defaultValue,
  onUserEdit,
  placeholder,
  minHeight = 220,
}: {
  name: string
  defaultValue: string
  onUserEdit?: (html: string) => void
  placeholder?: string
  minHeight?: number
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const editedRef = useRef(false)
  const [value, setValue] = useState(defaultValue)

  // Sunucudan yeni bir değer geldiğinde (ör. arka plan çevirisi bitince)
  // editörü tazele — ama kullanıcı bu alanda yazmışsa veya imleç içerideyse
  // dokunma, yazdığını silmeyelim.
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (editedRef.current) return
    if (document.activeElement === el) return
    if (el.innerHTML === defaultValue) return
    el.innerHTML = defaultValue || ''
    setValue(defaultValue)
  }, [defaultValue])

  function readEditor(): string {
    return editorRef.current?.innerHTML ?? ''
  }

  /** Gizli textarea'yı güncelle (form değeri). Kilit tetiklemez. */
  function sync() {
    setValue(readEditor())
  }

  /** Gerçek kullanıcı düzenlemesi: hem değeri güncelle hem kilidi bildir. */
  function userEdit() {
    const html = readEditor()
    editedRef.current = true
    setValue(html)
    onUserEdit?.(html)
  }

  function exec(command: string, arg?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    userEdit()
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
        onInput={userEdit}
        onBlur={sync}
        // Yapıştırmada biçim taşımasın
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
          userEdit()
        }}
        // İçerik React tarafından değil, yukarıdaki effect ile yazılıyor.
        // dangerouslySetInnerHTML kullanılsaydı React her yeniden çizimde
        // içeriği geri yazıp kullanıcının yazdığını silebilirdi.
        className="prose-legal max-w-none px-4 py-3 text-sm focus:outline-none"
        style={{ minHeight }}
      />

      <textarea name={name} value={value} readOnly hidden />
    </div>
  )
}
