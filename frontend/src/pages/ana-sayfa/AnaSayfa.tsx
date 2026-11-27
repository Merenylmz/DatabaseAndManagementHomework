import { useEffect, useState } from 'react'
import api, { hataMesaji } from '../../api/istemci'

// Şimdilik sadece backend bağlantısını kontrol ediyor
function AnaSayfa() {
  const [durum, setDurum] = useState('Backend kontrol ediliyor...')
  const [bagli, setBagli] = useState<boolean | null>(null)

  useEffect(() => {
    api
      .get('/health')
      .then(() => {
        setDurum('Backend ve veritabanı bağlantısı çalışıyor')
        setBagli(true)
      })
      .catch((hata) => {
        setDurum(hataMesaji(hata))
        setBagli(false)
      })
  }, [])

  return (
    <main className="sayfa">
      <h1>Otel Rezervasyon Sistemi</h1>
      <p className={bagli === null ? '' : bagli ? 'basarili' : 'hata'}>{durum}</p>
    </main>
  )
}

export default AnaSayfa
