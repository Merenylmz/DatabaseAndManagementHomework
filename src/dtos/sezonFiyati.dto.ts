import { z } from "zod/v3";

// Tarihler "2026-12-01" gibi yazı olarak gelir, coerce bunları Date'e çevirir
export const sezonFiyatiEkleSchema = z.object({
  oda_tipi_id: z.number().int().positive(),
  baslangic_tarihi: z.coerce.date(),
  bitis_tarihi: z.coerce.date(),
  gecelik_fiyat: z.number().positive(),
});

export const sezonFiyatiGuncelleSchema = sezonFiyatiEkleSchema.partial();

export type SezonFiyatiEkle = z.infer<typeof sezonFiyatiEkleSchema>;
export type SezonFiyatiGuncelle = z.infer<typeof sezonFiyatiGuncelleSchema>;
