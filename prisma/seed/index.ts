import { PrismaClient } from "@prisma/client";
import { odaSeed } from "./oda";
import { rezervasyonSeed } from "./rezervasyon";
import { kullaniciSeed } from "./kullanici";
import { personelSeed } from "./personel";
import { ekHizmetSeed } from "./ek_hizmet";
import { konaklamaSeed } from "./konaklama";


const prisma = new PrismaClient();

// Seed kendi dosyalarını sırayla çalıştırır.
async function main() {
  await odaSeed(prisma);
  await rezervasyonSeed(prisma);
  await kullaniciSeed(prisma);
  await personelSeed(prisma);
  await ekHizmetSeed(prisma);
  await konaklamaSeed(prisma);

}

main()
  .then(() => prisma.$disconnect())
  .catch(async (hata) => {
    console.error(hata);
    await prisma.$disconnect();
    process.exit(1);
  });