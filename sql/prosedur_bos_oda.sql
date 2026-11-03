DROP FUNCTION IF EXISTS bos_odalar(DATE, DATE, INT);

CREATE FUNCTION bos_odalar(p_giris DATE,p_cikis DATE, p_oda_tipi_id INT DEFAULT NULL)
RETURNS TABLE (oda_id INT, oda_numarasi VARCHAR, kat INT, oda_tipi VARCHAR, kapasite  INT, temel_fiyat  NUMERIC)
AS $$
    SELECT o.id, o.oda_numarasi, o.kat, t.ad, t.kapasite, t.temel_fiyat
    FROM oda o
    JOIN  oda_tipi t ON t.id = o.oda_tipi_id
    WHERE (p_oda_tipi_id IS NULL OR o.oda_tipi_id = p_oda_tipi_id)
    AND o.durum IS DISTINCT FROM 'bakimda'
    AND NOT EXISTS (
        SELECT 1 FROM  rezervasyon r
        WHERE r.oda_id = o.id
        AND r.durum <> 'iptal'
        AND p_giris < r.cikis_tarihi
        AND p_cikis > r.giris_tarihi
    )
    ORDER BY o.oda_numarasi;
    $$ LANGUAGE sql;