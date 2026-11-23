DROP VIEW IF EXISTS vw_oda_durumu;

CREATE VIEW vw_oda_durumu AS
SELECT 
    o.id AS oda_id,
    o.oda_numarasi,
    o.kat,
    ot.ad AS oda_tipi,
    o.durum,
    t.son_temizlik
FROM oda o
JOIN oda_tipi ot ON o.oda_tipi_id = ot.id

--Odaların son temizlik kaydı

LEFT JOIN (
    SELECT oda_id, MAX(temizlik_tarihi) AS son_temizlik
    FROM temizlik_kaydi
    GROUP BY oda_id
) t ON t.oda_id = o.id;