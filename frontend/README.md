# Otel Rezervasyon Sistemi Arayüzü

React + Vite + TypeScript ile yazıldı.

## Çalıştırma

Önce ana klasörde backend çalışıyor olmalı (`npm run dev`, port 3002).

```
cd frontend
npm install
npm run dev
```

Tarayıcıda http://localhost:5173 adresini açın.

## Klasörler

- `src/api/istemci.ts`: backend'e istek atan ortak axios nesnesi. `/api` ile başlayan istekler `vite.config.ts` içindeki proxy ile backend'e gider.
- `src/pages/`: her sayfa kendi klasöründe.
- `src/components/`: menü gibi ortak parçalar.
- `src/App.tsx`: sayfa adresleri ve hangi rolün hangi sayfayı açabileceği. Henüz yazılmamış sayfaların yerinde `YakindaSayfasi` var; sayfanızı yazınca kendi satırınızda onu değiştirin.
- `src/oturum/`: giriş yapan kullanıcının bilgisi ve token.

## Oturum nasıl kullanılır

Giriş başarılı olunca token ve kullanıcı bilgisi `girisYapildi` ile kaydedilir. Sonra kullanıcı rolünün ana sayfasına gönderilir:

```tsx
import { useNavigate } from 'react-router-dom'
import api, { hataMesaji } from '../../api/istemci'
import { rolAnaSayfasi } from '../../oturum/oturum'
import { useOturum } from '../../oturum/useOturum'

const { girisYapildi } = useOturum()
const navigate = useNavigate()

const cevap = await api.post('/auth/giris', { email, sifre })
girisYapildi(cevap.data.token, cevap.data.user_info)
navigate(rolAnaSayfasi(cevap.data.user_info.rol))
// hata olursa: hataMesaji(hata) backend'in mesajını verir (ör. "Hatalı Şifre Girdiniz.")
```

Bundan sonra `api` ile atılan her isteğe token kendiliğinden eklenir. Token geçersizse (401) oturum kendiliğinden kapanır.
Bir sayfada kullanıcıyı görmek için: `const { kullanici } = useOturum()` (`kullanici.rol`, `kullanici.email`).
