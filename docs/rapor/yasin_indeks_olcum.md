# İndeks ölçümü (ilk notlar)

Tarih: 23 Kasım 2026. Veri: 200 rezervasyon, 50 misafir, 20 oda.
Betik: `sql/test_indeks_olcum.sql` (psql'de `\i sql/test_indeks_olcum.sql`)

| Sorgu | Normal | Süre | Seq scan kapalı | Süre |
|---|---|---|---|---|
| Çakışma kontrolü (Trigger 1, Prosedür 1) | Seq Scan | 0.040 ms | Bitmap Index Scan (idx_rezervasyon_cikis) | 0.033 ms |
| Bugün giriş/çıkış (View 1) | Seq Scan | 0.019 ms | Bitmap Index Scan (idx_rezervasyon_giris + idx_rezervasyon_cikis) | 0.020 ms |
| Misafirin rezervasyonları | Seq Scan | 0.017 ms | Bitmap Index Scan (idx_rezervasyon_misafir) | 0.015 ms |

## Yorum

- 200 satırlık tablo diskte sadece 2 sayfa tutuyor. Bu yüzden PostgreSQL tabloyu baştan sona okumayı (Seq Scan) indeksten daha ucuz buluyor ve indeksi kendiliğinden kullanmıyor.
- `SET enable_seqscan = off` ile tam tarama kapatılınca üç sorgu da indeks kullandı. Yani indeksler doğru kurulmuş ve kullanılabiliyor.
- Giriş/çıkış sorgusunda iki indeks birlikte kullanıldı (BitmapOr). Tarihler için ayrı indeks açmamızın sebebi bu.
- Çakışma sorgusunda PostgreSQL `idx_rezervasyon_oda_tarih` yerine `idx_rezervasyon_cikis` seçti. Az veride hangi indeksin daha ucuz olduğuna kendisi karar veriyor. 10.000 kayıtla tekrar bakılacak.
- Süreler çok küçük olduğu için aradaki fark şu an anlamlı değil. Asıl karşılaştırma sonraki zaman yapılacak.
