import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { OturumContext } from './OturumContext'
import { kayitliOturum, OTURUM_KAPANDI_OLAYI, oturumuKaydet, oturumuTemizle, type Kullanici } from './oturum'

// Uygulamanın en dışına konur, içindeki her sayfa useOturum() ile oturuma ulaşır
function OturumSaglayici({ children }: { children: ReactNode }) {
  const [kullanici, setKullanici] = useState<Kullanici | null>(() => kayitliOturum()?.kullanici ?? null)

  const girisYapildi = useCallback((token: string, yeniKullanici: Kullanici) => {
    oturumuKaydet({ token, kullanici: yeniKullanici })
    setKullanici(yeniKullanici)
  }, [])

  const cikisYap = useCallback(() => {
    oturumuTemizle()
    setKullanici(null)
  }, [])

  // Backend 401 dönünce axios bu olayı yayınlar, burada da ekrandaki oturum kapatılır
  useEffect(() => {
    window.addEventListener(OTURUM_KAPANDI_OLAYI, cikisYap)
    return () => window.removeEventListener(OTURUM_KAPANDI_OLAYI, cikisYap)
  }, [cikisYap])

  const deger = useMemo(() => ({ kullanici, girisYapildi, cikisYap }), [kullanici, girisYapildi, cikisYap])

  return <OturumContext.Provider value={deger}>{children}</OturumContext.Provider>
}

export default OturumSaglayici
