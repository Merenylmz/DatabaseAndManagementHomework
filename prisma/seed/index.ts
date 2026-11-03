import { PrismaClient } from "@prisma/client";
import { odaSeed } from "./oda";
import { rezervasyonSeed } from "./rezervasyon";


const prisma = new PrismaClient();

// Seed kendi dosyalarını sırayla çalıştırır.
async function main() {
  await odaSeed(prisma);
  await rezervasyonSeed(prisma);

}

main()
  .then(() => prisma.$disconnect())
  .catch(async (hata) => {
    console.error(hata);
    await prisma.$disconnect();
    process.exit(1);
  });