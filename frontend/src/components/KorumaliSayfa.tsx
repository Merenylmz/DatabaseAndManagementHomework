import { Navigate, Outlet } from 'react-router-dom'
import { rolAnaSayfasi, type Rol } from '../oturum/oturum'
import { useOturum } from '../oturum/useOturum'

// İçindeki sayfaları sadece giriş yapmış ve rolü uygun kullanıcılar açabilir.
// Asıl güvenlik backend'deki roleControl'de; bu sadece kullanıcıyı yanlış sayfaya sokmamak için.
function KorumaliSayfa({ roller }: { roller: Rol[] }) {
  const { kullanici } = useOturum()

  if (!kullanici) return <Navigate to="/giris" replace />
  if (!roller.includes(kullanici.rol)) return <Navigate to={rolAnaSayfasi(kullanici.rol)} replace />
  return <Outlet />
}

export default KorumaliSayfa
