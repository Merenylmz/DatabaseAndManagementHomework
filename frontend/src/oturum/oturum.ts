// Backend'deki kullanici_rol enum'u ile aynı değerler
export type Rol = 'misafir' | 'resepsiyon' | 'yonetici'

// Giriş cevabındaki user_info alanı
export type Kullanici = {
  id: number
  rol: Rol
  email: string
}

export type Oturum = {
  token: string
  kullanici: Kullanici
}

const TOKEN_ANAHTARI = 'otel_token'
const KULLANICI_ANAHTARI = 'otel_kullanici'

// axios bu olayı yayınlayınca OturumSaglayici oturumu kapatır
export const OTURUM_KAPANDI_OLAYI = 'oturum-kapandi'

export const tokenAl = () => localStorage.getItem(TOKEN_ANAHTARI)

export const oturumuKaydet = ({ token, kullanici }: Oturum) => {
  localStorage.setItem(TOKEN_ANAHTARI, token)
  localStorage.setItem(KULLANICI_ANAHTARI, JSON.stringify(kullanici))
}

export const oturumuTemizle = () => {
  localStorage.removeItem(TOKEN_ANAHTARI)
  localStorage.removeItem(KULLANICI_ANAHTARI)
}

// JWT'nin ortadaki parçası base64 ile yazılmış JSON'dur, içindeki exp süresinin bittiği anı saniye olarak tutar
const suresiDolmus = (token: string) => {
  try {
    const parca = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const icerik = JSON.parse(atob(parca)) as { exp?: number }
    return !icerik.exp || icerik.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Sayfa açılırken çağrılır; token yoksa, bozuksa ya da süresi dolmuşsa null döner
export const kayitliOturum = (): Oturum | null => {
  const token = tokenAl()
  const kullaniciYazi = localStorage.getItem(KULLANICI_ANAHTARI)
  if (!token || !kullaniciYazi || suresiDolmus(token)) {
    oturumuTemizle()
    return null
  }
  try {
    return { token, kullanici: JSON.parse(kullaniciYazi) as Kullanici }
  } catch {
    oturumuTemizle()
    return null
  }
}

// Girişten sonra ve yetkisiz bir sayfaya girilince kullanıcının gönderileceği yer
export const rolAnaSayfasi = (rol: Rol) => {
  switch (rol) {
    case 'misafir':
      return '/arama'
    case 'resepsiyon':
      return '/resepsiyon'
    case 'yonetici':
      return '/yonetim/odalar'
  }
}
