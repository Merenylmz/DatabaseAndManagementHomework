import { PrismaClient } from "@prisma/client";

const adlar = ["Ali", "Veli", "Ayşe", "Fatma", "Hasan", "Hüseyin", "Cem", "Nur", "Kemal", "Esra"];
const soyadlar = ["Koç", "Turan", "Yılmaz", "Sönmez", "Öz", "Er", "Gül", "Tekin", "Çetin", "Ak"];

function rastgele(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function personelSeed(prisma: PrismaClient) {
  console.log("--- Personeller Ekleniyor ---");
  
  const personelKullanicilari = await prisma.kullanici.findMany({
    where: { rol: "resepsiyon" }
  });

  const personelVerileri = personelKullanicilari.map((kullanici, i) => {
    return {
      kullanici_id: kullanici.id,
      ad: adlar[rastgele(0, adlar.length - 1)],
      soyad: soyadlar[rastgele(0, soyadlar.length - 1)],
      telefon: `0544${String(i + 1).padStart(7, "0")}`,
      gorev: i % 2 === 0 ? "Resepsiyonist" : "Temizlik Görevlisi",
    };
  });

  await prisma.personel.createMany({ data: personelVerileri });
  console.log(`${personelVerileri.length} adet personel profili eklendi.`);
}