INSERT INTO rezervasyon (misafir_id, oda_id, giris_tarihi, cikis_tarihi, kisi_sayisi)
VALUES (1, 1, '2026-11-01', '2026-11-05', 2);

SELECT * FROM islem_log ORDER BY zaman DESC LIMIT 1;

INSERT INTO konaklama (rezervasyon_id, personel_id, gerceklesen_giris)
VALUES (1, 1, CURRENT_TIMESTAMP);

SELECT id, durum FROM oda WHERE id = 1;

UPDATE konaklama SET gerceklesen_cikis = CURRENT_TIMESTAMP WHERE rezervasyon_id = 1;

SELECT id, durum FROM oda WHERE id = 1;