# İndeks ölçümü

## 1. İlk ölçüm: 200 rezervasyon

Tarih: 23 Kasım 2026. Veri: 200 rezervasyon, 50 misafir, 20 oda.
O gün indeksler silinmeden, `SET enable_seqscan = off` ile tam tarama kapatılarak denendi.

| Sorgu | Normal | Süre | Seq scan kapalı | Süre |
|---|---|---|---|---|
| Çakışma kontrolü (Trigger 1, Prosedür 1) | Seq Scan | 0.040 ms | Bitmap Index Scan (idx_rezervasyon_cikis) | 0.033 ms |
| Bugün giriş/çıkış (View 1) | Seq Scan | 0.019 ms | Bitmap Index Scan (idx_rezervasyon_giris + idx_rezervasyon_cikis) | 0.020 ms |
| Misafirin rezervasyonları | Seq Scan | 0.017 ms | Bitmap Index Scan (idx_rezervasyon_misafir) | 0.015 ms |

- 200 satırlık tablo diskte sadece 2 sayfa tutuyor. PostgreSQL tabloyu baştan sona okumayı (Seq Scan) indeksten daha ucuz buldu ve indeksi kendiliğinden kullanmadı.
- Tam tarama kapatılınca üç sorgu da indeks kullandı, yani indeksler doğru kurulmuş.
- Süreler çok küçük olduğu için fark anlamlı değildi.

## 2. Asıl ölçüm: 10.200 rezervasyon

Tarih: 27 Kasım 2026. Veri: 10.200 rezervasyon (tablo diskte 86 sayfa), 50 misafir, 20 oda.

Nasıl yapıldı:

1. `sql/test_buyuk_veri.sql` ile 10.000 ek rezervasyon üretildi. Her odaya 2028'den 2033'e kadar arka arkaya 3 gecelik, çakışmayan rezervasyonlar eklendi. Kayıtların %10'u iptal durumunda.
2. `sql/test_indeks_olcum.sql` aynı üç sorguyu önce indekslerle çalıştırır. Sonra bir transaction içinde dört indeksi siler, sorguları tekrar çalıştırır ve `ROLLBACK` yapar. PostgreSQL'de `DROP INDEX` de geri alınabildiği için ölçümden sonra indeksler kendiliğinden geri gelir.
3. Betik 5 kez çalıştırıldı. Tabloda 5 ölçümün ortanca değeri var.

| Sorgu | Dönen satır | İndeksli plan | İndeksli süre | İndekssiz plan | İndekssiz süre | Hızlanma |
|---|---|---|---|---|---|---|
| Çakışma kontrolü (Trigger 1, Prosedür 1) | 2 | Bitmap Index Scan (idx_rezervasyon_oda_tarih) | 0.091 ms | Seq Scan | 0.373 ms | ~4 kat |
| Bugün giriş/çıkış (View 1) | 20 | Bitmap Index Scan (idx_rezervasyon_giris + idx_rezervasyon_cikis) | 0.028 ms | Seq Scan | 0.341 ms | ~12 kat |
| Misafirin rezervasyonları | 204 | Bitmap Index Scan (idx_rezervasyon_misafir) | 0.165 ms | Seq Scan | 0.253 ms | ~1.5 kat |

## Yorum

- Veri 10.200 satıra çıkınca PostgreSQL üç sorguda da indeksi kendiliğinden seçti. 200 satırda bunu yapmıyordu.
- İndeks olmadan her sorgu 10.200 satırın hepsini okuyor. İndeksle sadece aranan satırlara gidiliyor.
- En büyük fark giriş/çıkış sorgusunda çıktı (~12 kat), çünkü 10.200 satırdan sadece 20'si aranıyor. İki tarih indeksi birlikte kullanılıyor (BitmapOr).
- Çakışma sorgusunda bu sefer `oda_id` ve tarihleri birlikte tutan `idx_rezervasyon_oda_tarih` seçildi. Bu sorgu Trigger 1 ile her rezervasyon eklenirken çalışıyor. 10.000 kaydın eklenmesi toplam yaklaşık 2.5 saniye sürdü.
- Misafir sorgusunda fark küçük (~1.5 kat), çünkü sorgu tablonun yaklaşık %2'sini (204 satır) döndürüyor ve bu satırlar tabloda dağınık duruyor. Dönen satır sayısı arttıkça indeksin faydası azalıyor.
- Süreler milisaniyenin altında olsa da oran önemli. Veri büyüdükçe tam tarama süresi satır sayısıyla birlikte artar, indeksle arama ise neredeyse aynı kalır.
