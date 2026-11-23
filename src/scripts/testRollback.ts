import { PrismaClient } from '@prisma/client';

//!Bu kısım tamamen AI ile yazdırılmıştır.
const prisma = new PrismaClient();
async function rollbackTesti() {
  console.log('====================================================');
  console.log('   CHECK-OUT TRANSACTION ROLLBACK TESTİ BAŞLIYOR    ');
  console.log('====================================================\n');

  const aktifKonaklama = await prisma.konaklama.findFirst({
    where: { gerceklesen_cikis: null },
    include: {
      rezervasyon: { include: { oda: true } },
      odemeler: true
    }
  });

  if (!aktifKonaklama) {
    console.log('HATA: Test için aktif (gerceklesen_cikis = null) bir konaklama bulunamadı.');
    console.log('Önce bir rezervasyon için check-in yapıp testi tekrar çalıştırın.');
    return;
  }

  const konaklamaId = aktifKonaklama.id;
  const odaId = aktifKonaklama.rezervasyon.oda_id;
  const oncekiOdemeSayisi = aktifKonaklama.odemeler.length;

  console.log('--- [1] İŞLEM ÖNCESİ DURUM ---');
  console.log(`Konaklama ID        : ${konaklamaId}`);
  console.log(`gerceklesen_cikis   : ${aktifKonaklama.gerceklesen_cikis}`);
  console.log(`Ödeme Kaydı Sayısı  : ${oncekiOdemeSayisi}`);
  console.log(`Rezervasyon Durumu  : ${aktifKonaklama.rezervasyon.durum}`);
  console.log(`Oda Durumu          : ${aktifKonaklama.rezervasyon.oda.durum}\n`);

  console.log('--- [2] TRANSACTION BAŞLATILIYOR ---');
  try {
    await prisma.$transaction(async (tx) => {
      const tutarSonuc = await tx.$queryRaw<{ toplam_tutar: any }[]>`
        SELECT fn_konaklama_toplam_tutar(${konaklamaId}::int) AS toplam_tutar
      `;
      const toplamTutar = Number(tutarSonuc[0]?.toplam_tutar ?? 0);
      console.log(`-> Adım 1 (Prosedür 2) başarılı. Hesaplanan tutar: ${toplamTutar} TL`);

      await tx.konaklama.update({
        where: { id: konaklamaId },
        data: { gerceklesen_cikis: new Date() }
      });
      console.log('-> Adım 2 (gerceklesen_cikis güncelleme) transaction içinde yapıldı.');

      console.log('-> Adım 3 (Ödeme kaydı) sırasında BİLEREK HATA çıkarılıyor...');
      throw new Error('SİMÜLASYON HATASI: Ödeme sağlayıcısı (POS) yanıt vermedi!');

      await tx.oda.update({
        where: { id: odaId },
        data: { durum: 'temizlikte' }
      });
    });
  } catch (error: any) {
    console.log(`\n[YAKALANAN HATA]: ${error.message}`);
    console.log('[POSTGRESQL]: Transaction iptal edildi, ROLLBACK uygulandı.\n');
  }

  const sonrakiKonaklama = await prisma.konaklama.findUnique({
    where: { id: konaklamaId },
    include: {
      rezervasyon: { include: { oda: true } },
      odemeler: true
    }
  });

  console.log('--- [3] ROLLBACK SONRASI DURUM ---');
  console.log(`gerceklesen_cikis   : ${sonrakiKonaklama?.gerceklesen_cikis}`);
  console.log(`Ödeme Kaydı Sayısı  : ${sonrakiKonaklama?.odemeler.length}`);
  console.log(`Rezervasyon Durumu  : ${sonrakiKonaklama?.rezervasyon.durum}`);
  console.log(`Oda Durumu          : ${sonrakiKonaklama?.rezervasyon.oda.durum}\n`);

  const cikisHalaNull = sonrakiKonaklama?.gerceklesen_cikis === null;
  const odemeDegismedi = sonrakiKonaklama?.odemeler.length === oncekiOdemeSayisi;
  const odaDegismedi = sonrakiKonaklama?.rezervasyon.oda.durum === aktifKonaklama.rezervasyon.oda.durum;

  if (cikisHalaNull && odemeDegismedi && odaDegismedi) {
    console.log('✅ SONUÇ: ROLLBACK BAŞARILI! Adım 2 yapılmış olmasına rağmen veritabanında hiçbir yarım kayıt kalmadı.');
  } else {
    console.log('❌ SONUÇ: HATA! Veritabanında yarım kayıt oluştu.');
  }
}

rollbackTesti()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());