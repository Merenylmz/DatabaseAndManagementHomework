ALTER TABLE "rezervasyon" ADD CONSTRAINT check_tarih CHECK (cikis_tarihi > giris_tarihi);
ALTER TABLE "ek_hizmet" ADD CONSTRAINT check_ek_hizmet_fiyat CHECK (fiyat > 0);
ALTER TABLE "oda_tipi" ADD CONSTRAINT check_oda_fiyat CHECK (temel_fiyat > 0);