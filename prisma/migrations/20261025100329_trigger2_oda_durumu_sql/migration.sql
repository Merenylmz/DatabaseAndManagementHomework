CREATE OR REPLACE FUNCTION fn_oda_durumu_guncelle()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE oda 
        SET durum = 'dolu' 
        WHERE id = (SELECT oda_id FROM rezervasyon WHERE id = NEW.rezervasyon_id);
        
    ELSIF TG_OP = 'UPDATE' AND NEW.gerceklesen_cikis IS NOT NULL AND OLD.gerceklesen_cikis IS NULL THEN
        UPDATE oda 
        SET durum = 'temizlikte' 
        WHERE id = (SELECT oda_id FROM rezervasyon WHERE id = NEW.rezervasyon_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_konaklama_oda_durumu
AFTER INSERT OR UPDATE ON konaklama
FOR EACH ROW
EXECUTE FUNCTION fn_oda_durumu_guncelle();