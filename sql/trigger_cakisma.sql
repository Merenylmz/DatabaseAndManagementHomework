CREATE OR REPLACE FUNCTION rezervasyon_cakisma_kontrol() RETURNS trigger AS $$
BEGIN
    IF NEW.durum <> 'iptal' AND EXISTS (
        SELECT 1 FROM rezervasyon r
        WHERE r.oda_id = NEW.oda_id
        AND r.id  <> NEW.id
        AND r.durum <> 'iptal'
        AND NEW.giris_tarihi < r.cikis_tarihi
        AND NEW.cikis_tarihi > r.giris_tarihi
    ) THEN
    RAISE EXCEPTION 'Oda bu tarihlerde dolu';
    END IF;
    RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_rezervasyon_cakisma  ON rezervasyon;
    CREATE TRIGGER trg_rezervasyon_cakisma
    BEFORE INSERT OR UPDATE ON rezervasyon
    FOR EACH ROW EXECUTE FUNCTION rezervasyon_cakisma_kontrol();