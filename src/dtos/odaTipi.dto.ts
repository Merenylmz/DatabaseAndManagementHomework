import { z } from "zod/v3";

// Yeni oda tipi eklerken gelen istek bu kurallara uymalı
export const odaTipiEkleSchema = z.object({
  ad: z.string().min(1).max(50),
  kapasite: z.number().int().positive(),
  aciklama: z.string().optional(),
  temel_fiyat: z.number().positive(),
});

// Güncellemede alanların hepsi isteğe bağlı
export const odaTipiGuncelleSchema = odaTipiEkleSchema.partial();

export type OdaTipiEkle = z.infer<typeof odaTipiEkleSchema>;
export type OdaTipiGuncelle = z.infer<typeof odaTipiGuncelleSchema>;
