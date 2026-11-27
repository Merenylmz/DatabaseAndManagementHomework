import { z } from "zod/v3";

export const ekHizmetEkleSchema = z.object({
  ad: z.string().min(2, "Hizmet adı en az 2 karakter olmalı").max(100),
  fiyat: z.coerce.number().positive("Fiyat 0'dan büyük olmalı"),
});

export const ekHizmetGuncelleSchema = ekHizmetEkleSchema.partial();

export type EkHizmetEkleDto = z.infer<typeof ekHizmetEkleSchema>;
export type EkHizmetGuncelleDto = z.infer<typeof ekHizmetGuncelleSchema>;