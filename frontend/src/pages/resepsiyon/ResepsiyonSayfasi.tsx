import { useCallback, useEffect, useState, type FormEvent } from 'react'
import api, { hataMesaji } from '../../api/istemci'
import './ResepsiyonSayfasi.css'

type HareketSatir = Record<string, unknown>

type EkHizmet = {
  id: number
  ad: string
  fiyat: number | string
}

type CheckOutSonuc = {
  message?: string
  hesaplanan_tutar: number
  odeme?: {
    tutar: number | string
    odeme_turu: string
  }
  oda?: {
    oda_numarasi?: string
    durum?: string
  }
}

type OdemeTuru = 'nakit' | 'kredi_karti' | 'havale'

const metinAl = (satir: HareketSatir, anahtarlar: string[], varsayilan = '-'): string => {
  for (const k of anahtarlar) {
    const deger = satir[k]
    if (deger !== undefined && deger !== null && String(deger).trim() !== '') {
      return String(deger)
    }
  }
  return varsayilan
}

const sayiAl = (satir: HareketSatir, anahtarlar: string[]): number | null => {
  for (const k of anahtarlar) {
    const deger = satir[k]
    if (deger !== undefined && deger !== null && !Number.isNaN(Number(deger))) {
      return Number(deger)
    }
  }
  return null
}

const tarihBicimle = (deger: string): string => {
  if (deger === '-') return '-'
  const t = new Date(deger)
  return Number.isNaN(t.getTime()) ? deger : t.toLocaleDateString('tr-TR')
}

function ResepsiyonSayfasi() {
  const [hareketler, setHareketler] = useState<HareketSatir[]>([])
  const [ekHizmetler, setEkHizmetler] = useState<EkHizmet[]>([])
  const [listeYukleniyor, setListeYukleniyor] = useState(true)
  const [listeHata, setListeHata] = useState<string | null>(null)
  const [seciliIndex, setSeciliIndex] = useState<number | null>(null)

  const [checkInRezId, setCheckInRezId] = useState('')
  const [checkInYukleniyor, setCheckInYukleniyor] = useState(false)
  const [checkInMesaj, setCheckInMesaj] = useState<string | null>(null)
  const [checkInHata, setCheckInHata] = useState<string | null>(null)
  const [hizmetKonaklamaId, setHizmetKonaklamaId] = useState('')
  const [seciliHizmetId, setSeciliHizmetId] = useState('')
  const [hizmetAdet, setHizmetAdet] = useState('1')
  const [hizmetYukleniyor, setHizmetYukleniyor] = useState(false)
  const [hizmetMesaj, setHizmetMesaj] = useState<string | null>(null)
  const [hizmetHata, setHizmetHata] = useState<string | null>(null)

  const [checkOutKonaklamaId, setCheckOutKonaklamaId] = useState('')
  const [odemeTuru, setOdemeTuru] = useState<OdemeTuru>('kredi_karti')
  const [checkOutYukleniyor, setCheckOutYukleniyor] = useState(false)
  const [checkOutSonuc, setCheckOutSonuc] = useState<CheckOutSonuc | null>(null)
  const [checkOutHata, setCheckOutHata] = useState<string | null>(null)

  const hareketleriYukle = useCallback(async () => {
    setListeYukleniyor(true)
    setListeHata(null)
    try {
      const cevap = await api.get<{ list?: HareketSatir[]; data?: HareketSatir[] }>(
        '/resepsiyon/bugunku-hareketler',
      )
      const satirlar = cevap.data.list ?? cevap.data.data ?? (Array.isArray(cevap.data) ? cevap.data : [])
      setHareketler(satirlar)
    } catch (err) {
      setListeHata(hataMesaji(err))
    } finally {
      setListeYukleniyor(false)
    }
  }, [])

  const ekHizmetleriYukle = useCallback(async () => {
    try {
      const cevap = await api.get<{ data?: EkHizmet[]; list?: EkHizmet[] } | EkHizmet[]>('/ekhizmet')
      const veri = Array.isArray(cevap.data)
        ? cevap.data
        : cevap.data.data ?? cevap.data.list ?? []
      setEkHizmetler(veri)
      if (veri.length > 0) {
        setSeciliHizmetId((onceki) => onceki || String(veri[0].id))
      }
    } catch {
    }
  }, [])

  useEffect(() => {
    void hareketleriYukle()
    void ekHizmetleriYukle()
  }, [hareketleriYukle, ekHizmetleriYukle])

  const satirdanSec = (satir: HareketSatir, index: number) => {
    setSeciliIndex(index)
    const rezId = sayiAl(satir, ['rezervasyon_id', 'id'])
    const konaklamaId = sayiAl(satir, ['konaklama_id'])

    if (rezId !== null) setCheckInRezId(String(rezId))
    if (konaklamaId !== null) {
      setHizmetKonaklamaId(String(konaklamaId))
      setCheckOutKonaklamaId(String(konaklamaId))
    }
  }

  const checkInGonder = async (e: FormEvent) => {
    e.preventDefault()
    setCheckInMesaj(null)
    setCheckInHata(null)
    setCheckInYukleniyor(true)

    try {
      
      const cevap = await api.post<{ message?: string; konaklama?: { id: number } }>(
        '/resepsiyon/check-in',
        { rezervasyon_id: Number(checkInRezId) },
      )
      const yeniKonaklamaId = cevap.data.konaklama?.id
      setCheckInMesaj(
        yeniKonaklamaId
          ? `Check-in tamamlandı. Oluşan Konaklama ID: #${yeniKonaklamaId}`
          : cevap.data.message || 'Check-in başarıyla tamamlandı.',
      )
      if (yeniKonaklamaId) {
        setHizmetKonaklamaId(String(yeniKonaklamaId))
        setCheckOutKonaklamaId(String(yeniKonaklamaId))
      }
      setCheckInRezId('')
      await hareketleriYukle()
    } catch (err) {
      setCheckInHata(hataMesaji(err))
    } finally {
      setCheckInYukleniyor(false)
    }
  }

  const ekHizmetGonder = async (e: FormEvent) => {
    e.preventDefault()
    setHizmetMesaj(null)
    setHizmetHata(null)
    setHizmetYukleniyor(true)

    try {
      const cevap = await api.post<{ message?: string }>('/resepsiyon/ek-hizmet', {
        konaklama_id: Number(hizmetKonaklamaId),
        ek_hizmet_id: Number(seciliHizmetId),
        adet: Number(hizmetAdet),
      })
      setHizmetMesaj(cevap.data.message || 'Ek hizmet konaklamaya eklendi.')
      setHizmetAdet('1')
    } catch (err) {
      setHizmetHata(hataMesaji(err))
    } finally {
      setHizmetYukleniyor(false)
    }
  }

  const checkOutGonder = async (e: FormEvent) => {
    e.preventDefault()
    setCheckOutSonuc(null)
    setCheckOutHata(null)
    setCheckOutYukleniyor(true)

    try {
      const cevap = await api.post<CheckOutSonuc>('/resepsiyon/check-out', {
        konaklama_id: Number(checkOutKonaklamaId),
        odeme_turu: odemeTuru,
      })
      console.log(cevap);
      
      setCheckOutSonuc(cevap.data)
      setCheckOutKonaklamaId('')
      await hareketleriYukle()
    } catch (err) {
      setCheckOutHata(hataMesaji(err))
    } finally {
      setCheckOutYukleniyor(false)
    }
  }

  return (
    <main className="sayfa">
      <div className="resepsiyon-baslik">
        <div>
          <h1>Resepsiyon Paneli</h1>
          <p className="soluk" style={{ margin: '0.2rem 0 0' }}>
            Bugünkü giriş/çıkış hareketleri, check-in, ek hizmet ve ödeme işlemleri
          </p>
        </div>
        <button type="button" onClick={() => void hareketleriYukle()} disabled={listeYukleniyor}>
          {listeYukleniyor ? 'Yenileniyor...' : 'Listeyi Yenile'}
        </button>
      </div>

      <section className="resepsiyon-kart">
        <h2>Bugünkü Giriş / Çıkış Listesi</h2>

        {listeHata && <p className="hata">{listeHata}</p>}

        {listeYukleniyor ? (
          <p className="soluk">Hareketler yükleniyor...</p>
        ) : hareketler.length === 0 ? (
          <p className="soluk">
            Bugün için planlanmış giriş veya çıkış hareketi bulunmuyor. Aşağıdaki formlardan doğrudan
            Rezervasyon veya Konaklama ID girerek işlem yapabilirsiniz.
          </p>
        ) : (
          <div className="tablo-sarici">
            <table className="resepsiyon-tablo">
              <thead>
                <tr>
                  <th>Hareket</th>
                  <th>Rez. ID</th>
                  <th>Konaklama ID</th>
                  <th>Misafir</th>
                  <th>Oda</th>
                  <th>Giriş</th>
                  <th>Çıkış</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {hareketler.map((satir, i) => {
                  const hareket = metinAl(satir, ['hareket_tipi', 'hareket', 'tip', 'islem_tipi'])
                  const rezId = metinAl(satir, ['rezervasyon_id', 'id'])
                  const konaklamaId = metinAl(satir, ['konaklama_id'])
                  const misafir =
                    metinAl(satir, ['misafir_ad_soyad', 'misafir_adi', 'ad_soyad'], '') ||
                    `${metinAl(satir, ['misafir_ad', 'ad'], '')} ${metinAl(satir, ['misafir_soyad', 'soyad'], '')}`.trim() ||
                    '-'
                  const oda = metinAl(satir, ['oda_numarasi', 'oda_no', 'oda'])
                  const giris = tarihBicimle(metinAl(satir, ['giris_tarihi', 'planlanan_giris']))
                  const cikis = tarihBicimle(metinAl(satir, ['cikis_tarihi', 'planlanan_cikis']))
                  const durum = metinAl(satir, ['durum', 'rezervasyon_durumu', 'oda_durumu'])

                  return (
                    <tr key={`${rezId}-${konaklamaId}-${i}`} className={seciliIndex === i ? 'secili-satir' : ''}>
                      <td>
                        <span className="etiket">{hareket}</span>
                      </td>
                      <td>#{rezId}</td>
                      <td>{konaklamaId !== '-' ? `#${konaklamaId}` : '-'}</td>
                      <td>{misafir}</td>
                      <td>{oda}</td>
                      <td>{giris}</td>
                      <td>{cikis}</td>
                      <td>{durum}</td>
                      <td>
                        <div className="islem-butonlar">
                          <button type="button" onClick={() => satirdanSec(satir, i)}>
                            Seç
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="islem-grid">
        <div className="resepsiyon-kart">
          <h2>Check-in Yap</h2>
          <form className="islem-form" onSubmit={checkInGonder}>
            <div className="form-alan">
              <label htmlFor="checkInRezId">Rezervasyon ID</label>
              <input
                id="checkInRezId"
                type="number"
                min={1}
                value={checkInRezId}
                onChange={(e) => setCheckInRezId(e.target.value)}
                placeholder="Örn. 12"
                required
              />
            </div>

            <button type="submit" className="btn-vurgu" disabled={checkInYukleniyor}>
              {checkInYukleniyor ? 'İşleniyor...' : 'Check-in Tamamla'}
            </button>
          </form>

          {checkInMesaj && <p className="basarili">{checkInMesaj}</p>}
          {checkInHata && <p className="hata">{checkInHata}</p>}
        </div>

        <div className="resepsiyon-kart">
          <h2>Ek Hizmet Ekle</h2>
          <form className="islem-form" onSubmit={ekHizmetGonder}>
            <div className="form-alan">
              <label htmlFor="hizmetKonaklamaId">Konaklama ID</label>
              <input
                id="hizmetKonaklamaId"
                type="number"
                min={1}
                value={hizmetKonaklamaId}
                onChange={(e) => setHizmetKonaklamaId(e.target.value)}
                placeholder="Örn. 5"
                required
              />
            </div>

            <div className="form-alan">
              <label htmlFor="seciliHizmetId">Ek Hizmet</label>
              {ekHizmetler.length > 0 ? (
                <select
                  id="seciliHizmetId"
                  value={seciliHizmetId}
                  onChange={(e) => setSeciliHizmetId(e.target.value)}
                  required
                >
                  {ekHizmetler.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.ad} ({Number(h.fiyat).toLocaleString('tr-TR')} ₺)
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="seciliHizmetId"
                  type="number"
                  min={1}
                  value={seciliHizmetId}
                  onChange={(e) => setSeciliHizmetId(e.target.value)}
                  placeholder="Ek Hizmet ID"
                  required
                />
              )}
            </div>

            <div className="form-alan">
              <label htmlFor="hizmetAdet">Adet</label>
              <input
                id="hizmetAdet"
                type="number"
                min={1}
                value={hizmetAdet}
                onChange={(e) => setHizmetAdet(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-vurgu" disabled={hizmetYukleniyor}>
              {hizmetYukleniyor ? 'Ekleniyor...' : 'Hizmeti Ekle'}
            </button>
          </form>

          {hizmetMesaj && <p className="basarili">{hizmetMesaj}</p>}
          {hizmetHata && <p className="hata">{hizmetHata}</p>}
        </div>

        <div className="resepsiyon-kart">
          <h2>Check-out & Ödeme Al</h2>
          <form className="islem-form" onSubmit={checkOutGonder}>
            <div className="form-alan">
              <label htmlFor="checkOutKonaklamaId">Konaklama ID</label>
              <input
                id="checkOutKonaklamaId"
                type="number"
                min={1}
                value={checkOutKonaklamaId}
                onChange={(e) => setCheckOutKonaklamaId(e.target.value)}
                placeholder="Örn. 5"
                required
              />
            </div>

            <div className="form-alan">
              <label htmlFor="odemeTuru">Ödeme Türü</label>
              <select
                id="odemeTuru"
                value={odemeTuru}
                onChange={(e) => setOdemeTuru(e.target.value as OdemeTuru)}
              >
                <option value="kredi_karti">Kredi Kartı</option>
                <option value="nakit">Nakit</option>
                <option value="havale">Havale / EFT</option>
              </select>
            </div>

            <button type="submit" className="btn-vurgu" disabled={checkOutYukleniyor}>
              {checkOutYukleniyor ? 'Hesaplanıyor...' : 'Ödemeyi Al & Check-out Yap'}
            </button>
          </form>

          {checkOutHata && <p className="hata">{checkOutHata}</p>}

          {checkOutSonuc && (
            <div className="makbuz-kutu">
              <p className="makbuz-tutar">
                Toplam Tahsilat: {Number(checkOutSonuc.hesaplanan_tutar).toLocaleString('tr-TR')} ₺
              </p>
              <p>
                Ödeme Türü: <strong>{checkOutSonuc.odeme?.odeme_turu ?? odemeTuru}</strong>
              </p>
              {checkOutSonuc.oda?.durum && (
                <p>
                  Oda Durumu: <strong>{checkOutSonuc.oda.durum}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default ResepsiyonSayfasi