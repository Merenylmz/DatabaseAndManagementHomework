import { PrismaClient } from "@prisma/client";

export async function ekHizmetSeed(prisma: PrismaClient) {
  console.log("--- Ek Hizmetler Ekleniyo---");
  
  const hizmetler = [
    { ad: "Sabah Kahvaltısı (Açık Büfe)", fiyat: 250.00 },
    { ad: "Oda Servisi (Sıcak İçecek)", fiyat: 75.00 },
    { ad: "Oda Servisi (Yemek)", fiyat: 400.00 },
    { ad: "Kuru Temizleme", fiyat: 150.00 },
    { ad: "Spa & Masaj (1 Saat)", fiyat: 1200.00 },
    { ad: "Havalimanı Transferi", fiyat: 800.00 },
    { ad: "Mini Bar (Tam Dolum)", fiyat: 600.00 },
    { ad: "Ekstra Yatak", fiyat: 300.00 }
  ];

  await prisma.ek_Hizmet.createMany({ 
    data: hizmetler,
    skipDuplicates: true 
  });
  
  console.log(`${hizmetler.length} adet ek hizmet başarıyla eklendi`);
}