import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import api, { hataMesaji } from '../../api/istemci'
import { rolAnaSayfasi } from '../../oturum/oturum'
import { useOturum } from '../../oturum/useOturum'
import '../giris/AuthForm.css'

function KayitSayfasi() {
  const { kullanici } = useOturum()
  const navigate = useNavigate()

  const [ad, setAd] = useState('')
  const [soyad, setSoyad] = useState('')
  const [kimlikNo, setKimlikNo] = useState('')
  const [dogumTarihi, setDogumTarihi] = useState('')
  
  const [telefon, setTelefon] = useState('')
  const [ePosta, setEPosta] = useState('')
  const [sifre, setSifre] = useState('')
  const [hata, setHata] = useState<string | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)

  if (kullanici) {
    return <Navigate to={rolAnaSayfasi(kullanici.rol)} replace />
  }

  const gonder = async (e: FormEvent) => {
    e.preventDefault()
    setHata(null)
    setYukleniyor(true)

    try {
      await api.post('/auth/kayit', {
        ad: ad.trim(),
        soyad: soyad.trim(),
        kimlik_no: kimlikNo.trim(),
        dogum_tarihi: dogumTarihi ? new Date(dogumTarihi).toISOString() : undefined,
        telefon: telefon.trim(),
        e_posta: ePosta.trim(),
        sifre,
      })

      navigate('/giris', {
        replace: true,
        state: { mesaj: 'Kayıt işleminiz tamamlandı. Şimdi giriş yapabilirsiniz.' },
      })
    } catch (err) {
      setHata(hataMesaji(err))
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <main className="sayfa">
      <section className="auth-kart">
        <h1>Kayıt ol</h1>
        <p className="soluk">Rezervasyon yapabilmek için misafir hesabı oluşturun.</p>

        {hata && <p className="hata">{hata}</p>}

        <form className="auth-form" onSubmit={gonder}>
          <div className="auth-satir">
            <div className="auth-alan">
              <label htmlFor="ad">Ad</label>
              <input
                id="ad"
                type="text"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                required
              />
            </div>

            <div className="auth-alan">
              <label htmlFor="soyad">Soyad</label>
              <input
                id="soyad"
                type="text"
                value={soyad}
                onChange={(e) => setSoyad(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-satir">
            <div className="auth-alan">
              <label htmlFor="kimlikNo">TC Kimlik / Pasaport No</label>
              <input
                id="kimlikNo"
                type="text"
                value={kimlikNo}
                onChange={(e) => setKimlikNo(e.target.value)}
                required
              />
            </div>

            <div className="auth-alan">
              <label htmlFor="dogumTarihi">Doğum Tarihi</label>
              <input
                id="dogumTarihi"
                type="date"
                value={dogumTarihi}
                onChange={(e) => setDogumTarihi(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-alan">
            <label htmlFor="telefon">Telefon</label>
            <input
              id="telefon"
              type="tel"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              placeholder="05XX XXX XX XX"
              required
            />
          </div>

          <div className="auth-alan">
            <label htmlFor="ePosta">E-posta</label>
            <input
              id="ePosta"
              type="email"
              value={ePosta}
              onChange={(e) => setEPosta(e.target.value)}
              placeholder="ornek@mail.com"
              required
            />
          </div>

          <div className="auth-alan">
            <label htmlFor="sifre">Şifre</label>
            <input
              id="sifre"
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="auth-buton" disabled={yukleniyor}>
            {yukleniyor ? 'Kaydediliyor...' : 'Kayıt ol'}
          </button>
        </form>

        <p className="auth-alt">
          Zaten hesabınız var mı? <Link to="/giris">Giriş yap</Link>
        </p>
      </section>
    </main>
  )
}

export default KayitSayfasi