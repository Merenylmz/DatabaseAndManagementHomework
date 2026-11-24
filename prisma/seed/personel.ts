import { PrismaClient, KullaniciRol } from "@prisma/client";

const adlar = ["Ali", "Veli", "Ayşe", "Fatma", "Hasan", "Hüseyin", "Cem", "Nur", "Kemal", "Esra"];
const soyadlar = ["Koç", "Turan", "Yılmaz", "Sönmez", "Öz", "Er", "Gül", "Tekin", "Çetin", "Ak"];

function rastgele(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function personelSeed(prisma: PrismaClient) {
  console.log("--- Personeller Ekleniyor ---");

  const personelKullanicilari = await prisma.kullanici.findMany({
    where: {
      rol: { in: [KullaniciRol.resepsiyon, KullaniciRol.yonetici] },
      personel_id: null,
    },
  });

  for (let i = 0; i < personelKullanicilari.length; i++) {
    const kullanici = personelKullanicilari[i];

    const personel = await prisma.personel.create({
      data: {
        ad: adlar[rastgele(0, adlar.length - 1)],
        soyad: soyadlar[rastgele(0, soyadlar.length - 1)],
        gorev:
          kullanici.rol === KullaniciRol.yonetici
            ? "Yönetici"
            : i % 2 === 0
            ? "Resepsiyonist"
            : "Temizlik Görevlisi",
        ise_giris_tarihi: new Date(),
      },
    });

    await prisma.kullanici.update({
      where: { id: kullanici.id },
      data: { personel_id: personel.id },
    });
  }

  console.log(`${personelKullanicilari.length} adet personel profili eklendi ve kullanıcılara bağlandı.`);
}