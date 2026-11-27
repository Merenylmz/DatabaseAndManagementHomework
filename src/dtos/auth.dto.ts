import { z } from "zod/v3";

export const kayitOlSchema = z.object({
  ad: z.string().min(2, "Ad en az 2 karakter olmalı").max(50),
  soyad: z.string().min(2, "Soyad en az 2 karakter olmalı").max(50),
  kimlik_no: z.string().min(5, "Kimlik/Pasaport no geçersiz").max(20),
  dogum_tarihi: z.coerce.date(),
  e_posta: z.string().email("Geçerli bir e-posta giriniz"),
  telefon: z.string().min(10, "Telefon numarası en az 10 karakter olmalı").max(20),
  sifre: z.string().min(6, "Şifre en az 6 karakter olmalı").max(100),
  kullanici_adi: z.string().min(3).max(100).optional(),
});

export const girisYapSchema = z.object({
  email: z.string().email("Geçerli bir e-posta giriniz").optional(),
  kullanici_adi: z.string().min(1).optional(),
  sifre: z.string().min(1, "Şifre zorunludur"),
});

export type KayitOlDto = z.infer<typeof kayitOlSchema>;
export type GirisYapDto = z.infer<typeof girisYapSchema>;