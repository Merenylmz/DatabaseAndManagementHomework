import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { Rol } from '../oturum/oturum'
import { useOturum } from '../oturum/useOturum'

type Baglanti = { adres: string; yazi: string }

// Her rol menüde sadece kendi sayfalarını görür. Adresler App.tsx'teki Route'larla aynı olmalı.
const rolMenusu: Record<Rol, Baglanti[]> = {
  misafir: [
    { adres: '/arama', yazi: 'Oda ara' },
    { adres: '/rezervasyonlarim', yazi: 'Rezervasyonlarım' },
  ],
  resepsiyon: [
    { adres: '/resepsiyon', yazi: 'Giriş/çıkış' },
    { adres: '/oda-durumu', yazi: 'Oda durumu' },
  ],
  yonetici: [
    { adres: '/yonetim/odalar', yazi: 'Odalar' },
    { adres: '/yonetim/sezon-fiyatlari', yazi: 'Sezon fiyatları' },
    { adres: '/yonetim/ek-hizmetler', yazi: 'Ek hizmetler' },
    { adres: '/yonetim/personel', yazi: 'Personel' },
    { adres: '/yonetim/misafirler', yazi: 'Misafirler' },
    { adres: '/oda-durumu', yazi: 'Oda durumu' },
    { adres: '/rapor', yazi: 'Aylık rapor' },
    { adres: '/islem-gecmisi', yazi: 'İşlem geçmişi' },
  ],
}

const misafirMenusu: Baglanti[] = [
  { adres: '/giris', yazi: 'Giriş yap' },
  { adres: '/kayit', yazi: 'Kayıt ol' },
]

function Menu() {
  const { kullanici, cikisYap } = useOturum()
  const navigate = useNavigate()
  const baglantilar = kullanici ? rolMenusu[kullanici.rol] : misafirMenusu

  const cikis = () => {
    cikisYap()
    navigate('/giris')
  }

  return (
    <header className="menu">
      <Link to="/" className="menu-logo">
        Otel
      </Link>
      <nav className="menu-baglantilar">
        {baglantilar.map((b) => (
          <NavLink key={b.adres} to={b.adres}>
            {b.yazi}
          </NavLink>
        ))}
      </nav>
      {kullanici && (
        <div className="menu-kullanici">
          <span>{kullanici.email}</span>
          <button type="button" onClick={cikis}>
            Çıkış
          </button>
        </div>
      )}
    </header>
  )
}

export default Menu
