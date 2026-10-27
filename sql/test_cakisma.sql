BEGIN;

INSERT INTO oda_tipi (id, ad, kapasite, temel_fiyat) VALUES(9001, 'TEST Tipi', 2, 1000);
INSERT INTO oda(id, oda_numarasi, kat, oda_tipi_id) VALUES (9001, 'T-901', 9, 9001);
INSERT INTO misafir(id, ad, soyad, kimlik_no) VALUES (9001,'TEST', 'Misafir', 'TEST9001');

INSERT INTO rezervasyon(misafir_id, oda_id, giris_tarihi, cikis_tarihi , kisi_sayisi, durum)
VALUES (9001, 9001, '2026-11-10', '2026-11-15', 2, 'onayli');

-- Test 1 : 12-17 Kasım ilk rezervasyon çakışması / Reddedilmeli
DO $$
BEGIN
    INSERT INTO rezervasyon(misafir_id, oda_id, giris_tarihi, cikis_tarihi, kisi_sayisi)
    VALUES (9001,9001, '2026-11-12', '2026-11-17', 2);
    RAISE NOTICE 'Test  1 BAŞARISIZ: çakışan rezervasyon  kabul edildi';

    EXCEPTION WHEN raise_exception  THEN

    RAISE NOTICE 'TEST 1 BAŞARILI: çakışan rezervasyon  reddedildi (%)', SQLERRM;
  END $$;

-- Test 2: 15-20 Kasım ilk misafirin çıktığı gün giriş / Kabul edilmeli
DO $$
BEGIN
    INSERT INTO rezervasyon(misafir_id, oda_id, giris_tarihi, cikis_tarihi, kisi_sayisi)
    VALUES (9001, 9001, '2026-11-15', '2026-11-20', 2);
    RAISE NOTICE 'Test 2 BAŞARILI: cakismayan rezervasyon kabul edildi';
    EXCEPTION WHEN raise_exception THEN
    RAISE NOTICE 'TEST 2 BAŞARISIZ: %', SQLERRM;
  END $$;

-- Test 3: 1-5 Aralik rezervasyonu iptal edilmiş, 2-6 Aralık yeni rezervasyonu kabul edilmeli
INSERT INTO rezervasyon(misafir_id, oda_id, giris_tarihi, cikis_tarihi, kisi_sayisi, durum)
VALUES (9001, 9001, '2026-12-01', '2026-12-05', 2, 'iptal');

DO $$
BEGIN
    INSERT INTO rezervasyon(misafir_id, oda_id, giris_tarihi, cikis_tarihi, kisi_sayisi)
    VALUES (9001, 9001, '2026-12-02', '2026-12-06', 2);
    RAISE NOTICE 'TEST 3 BAŞARILI: iptal edilmiş rezervasyon çakısma sayılmadı';
    EXCEPTION WHEN raise_exception THEN
    RAISE NOTICE 'TEST 3 BAŞARISIZ: %', SQLERRM;
  END $$;

  ROLLBACK;