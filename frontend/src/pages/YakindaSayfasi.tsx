// Henüz yazılmamış sayfaların yerini tutar. Sayfa yazılınca App.tsx'te bunun yerine gerçek sayfa konur.
function YakindaSayfasi({ baslik }: { baslik: string }) {
  return (
    <main className="sayfa">
      <h1>{baslik}</h1>
      <p className="soluk">Bu sayfa henüz yapım aşamasında.</p>
    </main>
  )
}

export default YakindaSayfasi
