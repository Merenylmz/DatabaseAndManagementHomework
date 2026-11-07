import { PrismaClient } from "@prisma/client";

function rastgele(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function konaklamaSeed(prisma: PrismaClient) {
  console.log("--- Konaklam, Ödeme ve Temizlik Kayıtları Ekleniyor---");

  const rezervasyonlar = await prisma.rezervasyon.findMany({
    where: { 
      durum: { in: ["onayli", "tamamlandi"] } 
    },
    take: 50
  });

  const personeller = await prisma.personel.findMany();

  if (rezervasyonlar.length === 0 || personeller.length === 0) {
    console.log("UYARI: Rezervasyon veya Personel bulunamadı. Önceki seed'ler çalışmalı.");
    return;
  }

  const odemeTurleri: ("nakit" | "kredi_karti" | "havale")[] = ["nakit", "kredi_karti", "havale"];
  
  const temizlikDurumlari = ["Temizlendi", "Kirli", "Temizlik Bekliyor"]; 

  for (let i = 0; i < rezervasyonlar.length; i++) {
    const rez = rezervasyonlar[i];
    const atanacakPersonel = personeller[i % personeller.length];

    const konaklama = await prisma.konaklama.create({
      data: {
        rezervasyon_id: rez.id,
        personel_id: atanacakPersonel.id, 
        gerceklesen_giris: rez.giris_tarihi,
        gerceklesen_cikis: rez.durum === "tamamlandi" ? rez.cikis_tarihi : null,
      },
    });

    await prisma.odeme.create({
      data: {
        konaklama_id: konaklama.id,
        tutar: rastgele(1500, 12000), 
        odeme_turu: odemeTurleri[rastgele(0, 2)],
        tarih: rez.giris_tarihi,
      },
    });

    await prisma.temizlik_Kaydi.create({
      data: {
        oda_id: rez.oda_id,
        personel_id: atanacakPersonel.id,
        temizlik_tarihi: rez.giris_tarihi,
        durum: temizlikDurumlari[rastgele(0, 2)],
      },
    });
  }

  console.log(`${rezervasyonlar.length} rezervasyon için konaklama, ödeme ve temizlik işlemleri tamamlandı.`);
}