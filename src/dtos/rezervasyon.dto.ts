import { z } from "zod/v3";

const tarih = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih YYYY-AA-GG biçiminde olmalı");

export const rezervasyonEkleSchema = z.object({
  oda_id: z.number().int().positive(),
  giris_tarihi: tarih,
  cikis_tarihi: tarih,
  kisi_sayisi: z.number().int().positive(),
  // Sadece resepsiyon ve yönetici başkası adına rezervasyon yaparken gönderir
  misafir_id: z.number().int().positive().optional(),
});

export type RezervasyonEkle = z.infer<typeof rezervasyonEkleSchema>;
