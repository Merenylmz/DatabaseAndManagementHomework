-- Aynı üç sorgu önce indekslerle, sonra indeksler silinmiş hâlde çalışır.
-- Silme işlemi transaction içinde yapılır ve sonda ROLLBACK edilir, böylece indeksler geri gelir.
-- Çalıştırmak için: psql'de \i sql/test_indeks_olcum.sql

-- İndeksli
EXPLAIN ANALYZE SELECT 1 FROM rezervasyon r
WHERE r.oda_id = 5 AND r.durum <> 'iptal'
AND DATE '2030-06-01' < r.cikis_tarihi AND DATE '2030-06-05' > r.giris_tarihi;

EXPLAIN ANALYZE SELECT * FROM rezervasyon WHERE giris_tarihi = DATE '2030-05-30' OR cikis_tarihi = DATE '2030-05-30';

EXPLAIN ANALYZE SELECT * FROM rezervasyon WHERE misafir_id = 10;

-- İndekssiz
BEGIN;
DROP INDEX idx_rezervasyon_oda_tarih;
DROP INDEX idx_rezervasyon_giris;
DROP INDEX idx_rezervasyon_cikis;
DROP INDEX idx_rezervasyon_misafir;

EXPLAIN ANALYZE SELECT 1 FROM rezervasyon r
WHERE r.oda_id = 5 AND r.durum <> 'iptal'
AND DATE '2030-06-01' < r.cikis_tarihi AND DATE '2030-06-05' > r.giris_tarihi;

EXPLAIN ANALYZE SELECT * FROM rezervasyon WHERE giris_tarihi = DATE '2030-05-30' OR cikis_tarihi = DATE '2030-05-30';

EXPLAIN ANALYZE SELECT * FROM rezervasyon WHERE misafir_id = 10;

ROLLBACK;
