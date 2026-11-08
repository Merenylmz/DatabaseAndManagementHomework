import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export async function kullaniciSeed(prisma: PrismaClient) {
  console.log("--- Kullanıcılar Ekleniyor ---");
  
  const ornekSifre = "personel123";
  const hashedPassword = await bcrypt.hash(ornekSifre, 10);
  
  const kullaniciVerileri = [];
  
  for (let i = 1; i <= 50; i++) {
    kullaniciVerileri.push({
      kullanici_adi: `personel${i}@otel.com`,
      sifre_hash: hashedPassword,
      rol: "PERSONEL",
    });
  }

  for (let i = 1; i <= 5; i++) {
    kullaniciVerileri.push({
      kullanici_adi: `admin${i}@otel.com`,
      sifre_hash: hashedPassword,
      rol: "ADMIN",
    });
  }

  await prisma.kullanici.createMany({ data: (kullaniciVerileri as unknown as {id?: number, kullanici_adi: string, sifre_hash: string,rol: any }) });
  console.log(`${kullaniciVerileri.length} adet kullanıcı başarıyla eklendi.`);
}