-- Ne yapıyor ?
-- İndeks ölçümü için 10.000 ek rezervasyon üretir.
-- Her odaya 2028'den başlayarak arka arkaya 3 gecelik rezervasyon eklenir, aralarında 1 gün boşluk kalır.
-- Böylece hiçbir kayıt çakışmaz ve Trigger 1 hiçbirini reddetmez.
-- Daha önce çalıştırıldıysa tekrar eklemez.
INSERT INTO rezervasyon (misafir_id, oda_id, giris_tarihi, cikis_tarihi, kisi_sayisi, durum)
SELECT
    (n * 7) % 50 + 1,
    n % 20 + 1,
    DATE '2028-01-01' + (n / 20) * 4,
    DATE '2028-01-01' + (n / 20) * 4 + 3,
    n % 3 + 1,
    CASE WHEN n % 10 = 0 THEN 'iptal' ELSE 'onayli' END::rezervasyon_durumu
FROM generate_series(0, 9999) AS n
WHERE NOT EXISTS (SELECT 1 FROM rezervasyon WHERE giris_tarihi >= DATE '2028-01-01');

-- Tablo istatistiklerini güncelle, yoksa PostgreSQL eski 200 satırlık bilgiye göre plan seçer
ANALYZE rezervasyon;

SELECT count(*) AS toplam_rezervasyon FROM rezervasyon;
