-- Rezervasyon aramalari
CREATE INDEX IF NOT EXISTS idx_rezervasyon_oda_tarih ON rezervasyon (oda_id, giris_tarihi, cikis_tarihi);
CREATE INDEX IF NOT EXISTS idx_rezervasyon_giris ON rezervasyon (giris_tarihi);
CREATE INDEX IF NOT EXISTS idx_rezervasyon_cikis ON rezervasyon (cikis_tarihi);
CREATE INDEX IF NOT EXISTS idx_rezervasyon_misafir ON rezervasyon (misafir_id);

-- Temizlik ve odeme
CREATE INDEX IF NOT EXISTS idx_temizlik_oda_tarih ON temizlik_kaydi (oda_id, temizlik_tarihi);
CREATE INDEX IF NOT EXISTS idx_odeme_tarih ON odeme (tarih);