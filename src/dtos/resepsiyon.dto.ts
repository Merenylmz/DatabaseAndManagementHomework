import { z } from "zod/v3";

export const checkInSchema = z.object({
  rezervasyon_id: z.coerce.number().int().positive("Geçerli bir rezervasyon ID giriniz"),
  personel_id: z.coerce.number().int().positive().optional(),
});

export const konaklamaHizmetEkleSchema = z.object({
  konaklama_id: z.coerce.number().int().positive("Geçerli bir konaklama ID giriniz"),
  ek_hizmet_id: z.coerce.number().int().positive("Geçerli bir ek hizmet ID giriniz"),
  adet: z.coerce.number().int().positive("Adet en az 1 olmalı"),
});

export const temizlikEkleSchema = z.object({
  oda_id: z.coerce.number().int().positive("Geçerli bir oda ID giriniz"),
  durum: z.string().min(2).max(50).optional(),
  personel_id: z.coerce.number().int().positive().optional(),
});

export const checkOutSchema = z.object({
  konaklama_id: z.coerce.number().int().positive("Geçerli bir konaklama ID giriniz"),
  odeme_turu: z.enum(["nakit", "havale", "kredi_karti"]),
});

export type CheckInDto = z.infer<typeof checkInSchema>;
export type KonaklamaHizmetEkleDto = z.infer<typeof konaklamaHizmetEkleSchema>;
export type TemizlikEkleDto = z.infer<typeof temizlikEkleSchema>;
export type CheckOutDto = z.infer<typeof checkOutSchema>;