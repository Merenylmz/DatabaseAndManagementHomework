import { z } from "zod/v3";

export const misafirGuncelleSchema = z.object({
  ad: z.string().min(2).max(50).optional(),
  soyad: z.string().min(2).max(50).optional(),
  kimlik_no: z.string().min(5).max(20).optional(),
  dogum_tarihi: z.coerce.date().optional(),
  e_posta: z.string().email("Geçerli bir e-posta giriniz").optional(),
  telefon: z.string().min(10).max(20).optional(),
});

export type MisafirGuncelleDto = z.infer<typeof misafirGuncelleSchema>;