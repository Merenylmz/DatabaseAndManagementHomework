DROP VIEW IF EXISTS vw_bugunku_hareketlear;

CREATE VIEW vw_bugunku_hareketlear AS
SELECT 
    r.id AS rezervasyon_id,
    m.ad || ' ' || m.soyad AS misafir_ad_soyad,
    o.oda_numarasi,
    r.giris_tarihi,
    r.cikis_tarihi,
    CASE 
        WHEN r.giris_tarihi = CURRENT_DATE THEN 'Giriş Yapacak'
        WHEN r.cikis_tarihi = CURRENT_DATE THEN 'Çıkış Yapacak'
    END AS islem_turu
FROM rezervasyon r
JOIN misafir m ON r.misafir_id = m.id
JOIN oda o ON r.oda_id = o.id
WHERE r.giris_tarihi = CURRENT_DATE OR r.cikis_tarihi = CURRENT_DATE;