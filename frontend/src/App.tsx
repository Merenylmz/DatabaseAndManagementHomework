import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AnaSayfa from './pages/ana-sayfa/AnaSayfa'
import BulunamadiSayfasi from './pages/BulunamadiSayfasi'

// Her sayfa buraya tek satırla eklenir: <Route path="/adres" element={<Sayfa />} />
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="*" element={<BulunamadiSayfasi />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
