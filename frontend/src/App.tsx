import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Duzen from './components/Duzen'
import KorumaliSayfa from './components/KorumaliSayfa'
import OturumSaglayici from './oturum/OturumSaglayici'
import AnaSayfa from './pages/ana-sayfa/AnaSayfa'
import BulunamadiSayfasi from './pages/BulunamadiSayfasi'
import YakindaSayfasi from './pages/YakindaSayfasi'
import GirisSayfasi from './pages/giris/GirisSayfasi'
import KayitSayfasi from './pages/kayit/KayitSayfasi'
import ResepsiyonSayfasi from './pages/resepsiyon/ResepsiyonSayfasi'

function App() {
  return (
    <OturumSaglayici>
      <BrowserRouter>
        <Routes>
          <Route element={<Duzen />}>
            <Route path="/" element={<AnaSayfa />} />
            <Route path="/giris" element={<GirisSayfasi/>} />
            <Route path="/kayit" element={<KayitSayfasi/>} />

            <Route element={<KorumaliSayfa roller={['misafir']} />}>
              <Route path="/arama" element={<YakindaSayfasi baslik="Oda ara" />} />
              <Route path="/rezervasyonlarim" element={<YakindaSayfasi baslik="Rezervasyonlarım" />} />
            </Route>

            <Route element={<KorumaliSayfa roller={['resepsiyon', 'yonetici']} />}>
              <Route path="/resepsiyon" element={<ResepsiyonSayfasi />} />
              <Route path="/oda-durumu" element={<YakindaSayfasi baslik="Oda durumu" />} />
            </Route>

            <Route element={<KorumaliSayfa roller={['yonetici']} />}>
              <Route path="/yonetim/odalar" element={<YakindaSayfasi baslik="Odalar" />} />
              <Route path="/yonetim/sezon-fiyatlari" element={<YakindaSayfasi baslik="Sezon fiyatları" />} />
              <Route path="/yonetim/ek-hizmetler" element={<YakindaSayfasi baslik="Ek hizmetler" />} />
              <Route path="/yonetim/personel" element={<YakindaSayfasi baslik="Personel" />} />
              <Route path="/yonetim/misafirler" element={<YakindaSayfasi baslik="Misafirler" />} />
              <Route path="/rapor" element={<YakindaSayfasi baslik="Aylık rapor" />} />
              <Route path="/islem-gecmisi" element={<YakindaSayfasi baslik="İşlem geçmişi" />} />
            </Route>

            <Route path="*" element={<BulunamadiSayfasi />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </OturumSaglayici>
  )
}

export default App
