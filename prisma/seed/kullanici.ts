import { PrismaClient, KullaniciRol, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";


export async function kullaniciSeed(prisma: PrismaClient) {
  console.log("--- Kullanıcılar Ekleniyor ---");
  
  const ornekSifre = "personel123";
  const hashedPassword = await bcrypt.hash(ornekSifre, 10);
  
  const kullaniciVerileri : Prisma.KullaniciCreateManyInput[] = [];
  
  for (let i = 1; i <= 50; i++) {
    kullaniciVerileri.push({
      kullanici_adi: `personel${i}@otel.com`,
      sifre_hash: hashedPassword,
      rol: "resepsiyon",
    });
  }

  for (let i = 1; i <= 5; i++) {
    kullaniciVerileri.push({
      kullanici_adi: `admin${i}@otel.com`,
      sifre_hash: hashedPassword,
      rol: "yonetici",
    });
  }

  await prisma.kullanici.createMany({ data: kullaniciVerileri});
  console.log(`${kullaniciVerileri.length} adet kullanıcı başarıyla eklendi.`);
}