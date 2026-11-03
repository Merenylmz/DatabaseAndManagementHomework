import { PrismaClient } from "@prisma/client";

// Oda tiplerini, odaları ve sezon fiyatlarını eklemek için
export async function odaSeed(prisma: PrismaClient) {
  // Eski kayıtları sil ve id'leri 1'den başlat.
  await prisma.$executeRawUnsafe(
    "TRUNCATE TABLE sezon_fiyati, oda, oda_tipi RESTART IDENTITY CASCADE"
  );

  const tipler = [
    { ad: "Tek Kişilik", kapasite: 1, aciklama: "Tek yataklı standart oda", temel_fiyat: 1500 },
    { ad: "Çift Kişilik", kapasite: 2, aciklama: "Çift kişilik yataklı oda", temel_fiyat: 2200 },
    { ad: "Aile", kapasite: 4, aciklama: "Bir çift ve iki tek yataklı geniş oda", temel_fiyat: 3200 },
    { ad: "Suit", kapasite: 2, aciklama: "Oturma alanı olan deniz manzaralı oda", temel_fiyat: 5000 },
  ];

  const odaTipleri = [];
  for (const tip of tipler) {
    odaTipleri.push(await prisma.odaTipi.create({ data: tip }));
  }

  // 5 kat, her katta 4 oda 
  const odalar = [];
  for (let kat = 1; kat <= 5; kat++) {
    for (let sira = 1; sira <= 4; sira++) {
      odalar.push({
        oda_numarasi: `${kat}0${sira}`,
        kat: kat,
        durum: "bos" as const,
        oda_tipi_id: odaTipleri[sira - 1].id,
      });
    }
  }
  await prisma.oda.createMany({ data: odalar });

  // Her gün sezona düşsün diye 4 sezon
  const sezonlar = [
    { baslangic: "01-01", bitis: "03-31", carpan: 0.8 },
    { baslangic: "04-01", bitis: "05-31", carpan: 1.0 },
    { baslangic: "06-01", bitis: "09-30", carpan: 1.5 },
    { baslangic: "10-01", bitis: "12-31", carpan: 1.0 },
  ];

  const fiyatlar = [];
  for (const tip of odaTipleri) {
    for (const yil of [2026, 2027]) {
      for (const sezon of sezonlar) {
        fiyatlar.push({
          oda_tipi_id: tip.id,
          baslangic_tarihi: new Date(`${yil}-${sezon.baslangic}`),
          bitis_tarihi: new Date(`${yil}-${sezon.bitis}`),
          gecelik_fiyat: Number(tip.temel_fiyat) * sezon.carpan,
        });
      }
    }
  }
  await prisma.sezonFiyati.createMany({ data: fiyatlar });

  console.log(`${odaTipleri.length} oda tipi, ${odalar.length} oda, ${fiyatlar.length} sezon fiyatı eklendi.`);
}
