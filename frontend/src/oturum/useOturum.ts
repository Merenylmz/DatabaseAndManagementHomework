import { useContext } from 'react'
import { OturumContext } from './OturumContext'

// Sayfalarda: const { kullanici, girisYapildi, cikisYap } = useOturum()
export const useOturum = () => {
  const deger = useContext(OturumContext)
  if (!deger) throw new Error('useOturum, OturumSaglayici içinde kullanılmalı')
  return deger
}
