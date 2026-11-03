import { PrismaClient, RezervasyonDurumu } from "@prisma/client";

const adlar = [
  "Ahmet", "Mehmet", "Ayşe", "Fatma", "Mustafa", "Zeynep", "Emre", "Elif", "Can", "Merve",
  "Burak", "Selin", "Kerem", "Deniz", "Ece", "Hakan", "Gamze", "Onur", "Derya", "Serkan",
];
const soyadlar = [
  "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Aydın", "Öztürk", "Arslan", "Doğan",
  "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt", "Özdemir", "Polat", "Korkmaz", "Erdoğan",
];

const MISAFIR_SAYISI = 50;
const ODA_BASINA_REZERVASYON = 10;
const GUN = 24 * 60 * 60 * 1000;

// min ile max arasında rastgele tam sayı döndürmek için
function rastgele(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gunEkle(tarih: Date, gun: number) {
  return new Date(tarih.getTime() + gun * GUN);
}

// Misafirleri ve rezervasyonları eklemek için
export async function rezervasyonSeed(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe(
    "TRUNCATE TABLE rezervasyon, misafir, islem_log RESTART IDENTITY CASCADE"
  );

  const misafirVerileri = [];
  for (let i = 1; i <= MISAFIR_SAYISI; i++) {
    misafirVerileri.push({
      ad: adlar[rastgele(0, adlar.length - 1)],
      soyad: soyadlar[rastgele(0, soyadlar.length - 1)],
      kimlik_no: String(10000000000 + i),
      telefon: `0555${String(i).padStart(7, "0")}`,
      e_posta: `misafir${i}@ornek.com`,
      dogum_tarihi: new Date(`${rastgele(1960, 2005)}-0${rastgele(1, 9)}-15`),
    });
  }
  await prisma.misafir.createMany({ data: misafirVerileri });

  const misafirler = await prisma.misafir.findMany();
  const odalar = await prisma.oda.findMany({ include: { oda_tipi: true } });
  const bugun = new Date();

  const rezervasyonlar = [];
  for (const oda of odalar) {
    // Her odanın tarihi kendi içinde hep ileri gider, böylece çakışma olmaz.
    let tarih = new Date("2026-08-01");

    for (let i = 0; i < ODA_BASINA_REZERVASYON; i++) {
      const giris = gunEkle(tarih, rastgele(0, 14));
      const cikis = gunEkle(giris, rastgele(1, 7));

      let durum: RezervasyonDurumu = "onayli";
      if (rastgele(1, 10) === 1) {
        durum = "iptal";
      } else if (cikis < bugun) {
        durum = "tamamlandi";
      } else if (rastgele(1, 2) === 1) {
        durum = "beklemede";
      }

      rezervasyonlar.push({
        misafir_id: misafirler[rezervasyonlar.length % misafirler.length].id,
        oda_id: oda.id,
        giris_tarihi: giris,
        cikis_tarihi: cikis,
        kisi_sayisi: rastgele(1, oda.oda_tipi.kapasite),
        durum: durum,
      });

      tarih = cikis;
    }
  }
  await prisma.rezervasyon.createMany({ data: rezervasyonlar });

  console.log(`${misafirler.length} misafir, ${rezervasyonlar.length} rezervasyon eklendi.`);
}