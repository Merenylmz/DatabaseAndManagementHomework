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
