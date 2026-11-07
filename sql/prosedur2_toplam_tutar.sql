DROP FUNCTION IF EXISTS fn_konaklama_toplam_tutar;

CREATE OR REPLACE FUNCTION fn_konaklama_toplam_tutar(p_konaklama_id INT)
RETURNS DECIMAL AS $$
DECLARE
    v_oda_tutari DECIMAL(10,2) := 0;
    v_ek_hizmet_tutari DECIMAL(10,2) := 0;
    v_toplam DECIMAL(10,2) := 0;
BEGIN
    SELECT COALESCE(SUM(sf.gecelik_fiyat), 0)
    INTO v_oda_tutari
    FROM konaklama k
    JOIN rezervasyon r ON k.rezervasyon_id = r.id
    JOIN oda o ON r.oda_id = o.id
    CROSS JOIN generate_series(
        k.gerceklesen_giris::DATE, 
        COALESCE(k.gerceklesen_cikis::DATE, CURRENT_DATE) - INTERVAL '1 day', 
        '1 day'::interval
    ) AS stay_date
    JOIN sezon_fiyati sf ON sf.oda_tipi_id = o.oda_tipi_id 
                         AND stay_date >= sf.baslangic_tarihi 
                         AND stay_date <= sf.bitis_tarihi
    WHERE k.id = p_konaklama_id;

    SELECT COALESCE(SUM(eh.fiyat * kh.adet), 0)
    INTO v_ek_hizmet_tutari
    FROM konaklama_hizmeti kh
    JOIN ek_hizmet eh ON kh.ek_hizmet_id = eh.id
    WHERE kh.konaklama_id = p_konaklama_id;

    v_toplam := v_oda_tutari + v_ek_hizmet_tutari;
    
    RETURN v_toplam;
END;
$$ LANGUAGE plpgsql;