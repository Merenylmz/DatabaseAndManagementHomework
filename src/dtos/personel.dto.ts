import { z } from "zod/v3";

export const personelEkleSchema = z.object({
  ad: z.string().min(2, "Ad en az 2 karakter olmalı").max(50),
  soyad: z.string().min(2, "Soyad en az 2 karakter olmalı").max(50),
  gorev: z.string().min(2, "Görev en az 2 karakter olmalı").max(100),
});

export const personelGuncelleSchema = personelEkleSchema.partial();

export type PersonelEkleDto = z.infer<typeof personelEkleSchema>;
export type PersonelGuncelleDto = z.infer<typeof personelGuncelleSchema>;