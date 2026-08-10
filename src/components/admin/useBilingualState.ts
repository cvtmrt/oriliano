'use client'

import { useRef, useState } from 'react'

/**
 * İki dilli alanların ortak durum mantığı.
 *
 * İki şeyi birlikte çözüyor:
 *
 * 1. **Tazeleme.** Arka plan çevirisi bitip sayfa yeniden çizildiğinde
 *    sunucudan gelen yeni İngilizce metin kutuya yansımalı. `useState` tek
 *    başına bunu yapmaz (ilk değeri saklar), bu yüzden alanlar çeviri
 *    bittikten sonra da boş görünüyordu.
 *
 * 2. **Yanlış kilit.** Kullanıcı bu alanda gerçekten yazmadıysa kilit
 *    kurulmamalı. Yazdıysa da sunucudan gelen değer yazdığını silmemeli.
 */
export function useBilingualState(valueEn: string, status?: string | null) {
  const editedRef = useRef(false)
  const [en, setEn] = useState(valueEn)
  const [manual, setManual] = useState(status === 'MANUAL')

  const [seenEn, setSeenEn] = useState(valueEn)
  const [seenStatus, setSeenStatus] = useState(status)

  if (valueEn !== seenEn || status !== seenStatus) {
    setSeenEn(valueEn)
    setSeenStatus(status)
    if (!editedRef.current) {
      setEn(valueEn)
      setManual(status === 'MANUAL')
    }
  }

  function edit(value: string) {
    editedRef.current = true
    setEn(value)
    setManual(true)
  }

  function release() {
    editedRef.current = false
    setManual(false)
  }

  return { en, manual, edit, release }
}
