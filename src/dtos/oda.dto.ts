import { z } from "zod/v3";

export const odaEkleSchema = z.object({
  oda_numarasi: z.string().min(1).max(10),
  kat: z.number().int(),
  oda_tipi_id: z.number().int().positive(),
  durum: z.enum(["bos", "dolu", "temizlikte", "bakimda"]).optional(),
});

export const odaGuncelleSchema = odaEkleSchema.partial();

export type OdaEkle = z.infer<typeof odaEkleSchema>;
export type OdaGuncelle = z.infer<typeof odaGuncelleSchema>;
