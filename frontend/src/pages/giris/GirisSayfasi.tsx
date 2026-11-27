import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import api, { hataMesaji } from '../../api/istemci'
import { rolAnaSayfasi, type Kullanici } from '../../oturum/oturum'
import { useOturum } from '../../oturum/useOturum'
import './AuthForm.css'

type GirisCevap = {
  success: boolean
  message: string
  token: string
  user_info: Kullanici
}

function GirisSayfasi() {
  const { kullanici, girisYapildi } = useOturum()
  const navigate = useNavigate()
  const location = useLocation()
  const bilgiMesaji = (location.state as { mesaj?: string } | null)?.mesaj

  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [hata, setHata] = useState<string |null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)

  if (kullanici) {
    return <Navigate to={rolAnaSayfasi(kullanici.rol)} replace />
  }

  const gonder = async (e: FormEvent) => {
    e.preventDefault()
    setHata(null)
    setYukleniyor(true)

    try {
      const cevap = await api.post<GirisCevap>('/auth/giris', { email, sifre })

      girisYapildi(cevap.data.token, cevap.data.user_info)
      navigate(rolAnaSayfasi(cevap.data.user_info.rol), { replace: true })

    } catch (err) {
        setHata(hataMesaji(err))
    } finally {
        setYukleniyor(false)
    }
  }

  return (
    <main className="sayfa">
      <section className="auth-kart">
        <h1>Giriş yap</h1>
        <p className="soluk">Hesabınıza erişmek için e-posta ve şifrenizi girin.</p>

        {bilgiMesaji && <p className="basarili">{bilgiMesaji}</p>}
        {hata && <p className="hata">{hata}</p>}

        <form className="auth-form" onSubmit={gonder}>
          <div className="auth-alan">
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@otel.com"
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
              required
            />
          </div>

          <button type="submit" className="auth-buton" disabled={yukleniyor}>
            {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş yap'}
          </button>
        </form>

        <p className="auth-alt">
          Hesabınız yok mu? <Link to="/kayit">Kayıt ol</Link>
        </p>
      </section>
    </main>
  )
}

export default GirisSayfasi