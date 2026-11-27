import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import api, { hataMesaji } from '../../api/istemci'
import { rolAnaSayfasi } from '../../oturum/oturum'
import { useOturum } from '../../oturum/useOturum'

// Giriş yapmış kullanıcı kendi rolünün sayfasına gider, yapmamışsa karşılama ve bağlantı durumu görünür
function AnaSayfa() {
  const { kullanici } = useOturum()
  const [durum, setDurum] = useState('Backend kontrol ediliyor...')
  const [bagli, setBagli] = useState<boolean | null>(null)

  useEffect(() => {
    if (kullanici) return
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
  }, [kullanici])

  if (kullanici) return <Navigate to={rolAnaSayfasi(kullanici.rol)} replace />

  return (
    <main className="sayfa">
      <h1>Otel Rezervasyon Sistemi</h1>
      <p>
        Rezervasyon yapmak için <Link to="/giris">giriş yapın</Link> ya da <Link to="/kayit">kayıt olun</Link>.
      </p>
      <p className={bagli === null ? 'soluk' : bagli ? 'basarili' : 'hata'}>{durum}</p>
    </main>
  )
}

export default AnaSayfa
