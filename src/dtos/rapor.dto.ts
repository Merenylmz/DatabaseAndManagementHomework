import { z } from "zod/v3";

// Adresten gelen değerler yazı olduğu için coerce ile sayıya çeviriyoruz
export const aylikRaporSchema = z.object({
  yil: z.coerce
    .number({ invalid_type_error: "yil bir sayı olmalı" })
    .int()
    .min(2000, "yil 2000 ile 2100 arasında olmalı")
    .max(2100, "yil 2000 ile 2100 arasında olmalı"),
  ay: z.coerce
    .number({ invalid_type_error: "ay bir sayı olmalı" })
    .int()
    .min(1, "ay 1 ile 12 arasında olmalı")
    .max(12, "ay 1 ile 12 arasında olmalı"),
});

// Trigger 3 sadece bu iki tabloyu ve bu üç işlemi log'a yazıyor
export const islemGecmisiSchema = z.object({
  tablo: z.enum(["rezervasyon", "odeme"], { errorMap: () => ({ message: "tablo rezervasyon veya odeme olmalı" }) }).optional(),
  islem: z.enum(["INSERT", "UPDATE", "DELETE"], { errorMap: () => ({ message: "islem INSERT, UPDATE veya DELETE olmalı" }) }).optional(),
  sayfa: z.coerce.number({ invalid_type_error: "sayfa bir sayı olmalı" }).int().min(1, "sayfa en az 1 olmalı").default(1),
  limit: z.coerce
    .number({ invalid_type_error: "limit bir sayı olmalı" })
    .int()
    .min(1, "limit 1 ile 100 arasında olmalı")
    .max(100, "limit 1 ile 100 arasında olmalı")
    .default(20),
});

export type IslemGecmisiFiltre = z.infer<typeof islemGecmisiSchema>;
