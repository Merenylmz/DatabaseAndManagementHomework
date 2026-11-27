import { Link } from 'react-router-dom'

function BulunamadiSayfasi() {
  return (
    <main className="sayfa">
      <h1>Sayfa bulunamadı</h1>
      <p>
        <Link to="/">Ana sayfaya dön</Link>
      </p>
    </main>
  )
}

export default BulunamadiSayfasi
