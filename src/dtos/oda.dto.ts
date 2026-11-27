import { z } from "zod/v3";

export const odaEkleSchema = z.object({
  oda_numarasi: z.string().min(1).max(10),
  kat: z.number().int(),
  oda_tipi_id: z.number().int().positive(),
  durum: z.enum(["bos", "dolu", "temizlikte", "bakimda"]).optional(),
});

export const odaGuncelleSchema = odaEkleSchema.partial();

const tarih = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih YYYY-AA-GG biçiminde olmalı");

export const bosOdaAraSchema = z
  .object({
    giris: tarih,
    cikis: tarih,
    odaTipiId: z.coerce.number().int().positive().optional(),
  })
  .refine((v) => v.cikis > v.giris, { message: "Çıkış tarihi girişten sonra olmalı", path: ["cikis"] });

export type OdaEkle = z.infer<typeof odaEkleSchema>;
export type OdaGuncelle = z.infer<typeof odaGuncelleSchema>;
