DROP FUNCTION IF EXISTS aylik_rapor(INT, INT);

CREATE FUNCTION aylik_rapor(p_yil INT, p_ay INT)
RETURNS TABLE (toplam_oda INT, gun_sayisi INT, dolu_gece INT, doluluk_orani NUMERIC, gelir NUMERIC)
AS $$
DECLARE
    v_ay_basi DATE := make_date(p_yil, p_ay, 1);
    v_ay_sonu DATE := (make_date(p_yil, p_ay, 1) + INTERVAL '1 month')::DATE;
    v_toplam_oda INT;
    v_gun_sayisi INT;
    v_dolu_gece INT;
    v_gelir NUMERIC;
BEGIN
    SELECT COUNT(*) INTO v_toplam_oda FROM oda;

    v_gun_sayisi := v_ay_sonu - v_ay_basi;

    -- Kontrol : Ay sınırını aşan rezervasyonların sadece bu aya düşen geceleri sayılır
    SELECT COALESCE(SUM(LEAST(r.cikis_tarihi, v_ay_sonu) - GREATEST(r.giris_tarihi, v_ay_basi)), 0)
    INTO v_dolu_gece
    FROM rezervasyon r
    WHERE r.durum <> 'iptal'
    AND r.giris_tarihi < v_ay_sonu
    AND r.cikis_tarihi > v_ay_basi;

    SELECT COALESCE(SUM(od.tutar), 0)
    INTO v_gelir
    FROM odeme od
    WHERE od.tarih >= v_ay_basi
    AND od.tarih < v_ay_sonu;

    RETURN QUERY SELECT
        v_toplam_oda,
        v_gun_sayisi,
        v_dolu_gece,
        ROUND(100.0 * v_dolu_gece / NULLIF(v_toplam_oda * v_gun_sayisi, 0), 2),
        v_gelir;
END;
$$ LANGUAGE plpgsql;