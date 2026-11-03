CREATE OR REPLACE FUNCTION fn_islem_logla()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO islem_log (tablo_adi, islem_turu, eski_veri, yeni_veri)
        VALUES (TG_TABLE_NAME, 'INSERT', NULL, row_to_json(NEW));
        RETURN NEW;
        
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO islem_log (tablo_adi, islem_turu, eski_veri, yeni_veri)
        VALUES (TG_TABLE_NAME, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO islem_log (tablo_adi, islem_turu, eski_veri, yeni_veri)
        VALUES (TG_TABLE_NAME, 'DELETE', row_to_json(OLD), NULL);
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rezervasyon_log
AFTER INSERT OR UPDATE OR DELETE ON rezervasyon
FOR EACH ROW
EXECUTE FUNCTION fn_islem_logla();

CREATE TRIGGER trg_odeme_log
AFTER INSERT OR UPDATE OR DELETE ON odeme
FOR EACH ROW
EXECUTE FUNCTION fn_islem_logla();