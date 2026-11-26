import prisma from "../config/dbPrisma";
import { RezervasyonEkle } from "../dtos/rezervasyon.dto";

const hata = (mesaj: string, statusCode: number) => Object.assign(new Error(mesaj), { statusCode });

// Misafir kendi adına rezervasyon yapar, resepsiyon ve yönetici misafir_id göndermek zorunda
const misafirIdBul = async (kullaniciId: number, rol: string, gelenMisafirId?: number) => {
  if (rol === "misafir") {
    const kullanici = await prisma.kullanici.findUnique({ where: { id: kullaniciId } });
    if (!kullanici?.misafir_id) throw hata("Bu hesaba bağlı misafir kaydı yok", 400);
    return kullanici.misafir_id;
  }

  if (!gelenMisafirId) throw hata("misafir_id gönderilmeli", 400);
  const misafir = await prisma.misafir.findUnique({ where: { id: gelenMisafirId } });
  if (!misafir) throw hata("Misafir bulunamadı", 404);
  return misafir.id;
};

const rezervasyonOlustur = async (veri: RezervasyonEkle, kullaniciId: number, rol: string) => {
  if (veri.cikis_tarihi <= veri.giris_tarihi) throw hata("Çıkış tarihi girişten sonra olmalı", 400);

  const misafirId = await misafirIdBul(kullaniciId, rol, veri.misafir_id);

  const oda = await prisma.oda.findUnique({ where: { id: veri.oda_id }, include: { oda_tipi: true } });
  if (!oda) throw hata("Oda bulunamadı", 404);
  if (veri.kisi_sayisi > oda.oda_tipi.kapasite) {
    throw hata(`Bu oda en fazla ${oda.oda_tipi.kapasite} kişiliktir`, 400);
  }

  try {
    return await prisma.rezervasyon.create({
      data: {
        misafir_id: misafirId,
        oda_id: veri.oda_id,
        giris_tarihi: new Date(veri.giris_tarihi),
        cikis_tarihi: new Date(veri.cikis_tarihi),
        kisi_sayisi: veri.kisi_sayisi,
      },
    });
  } catch (error: any) {
    // Çakışmayı trigger_cakisma.sql yakalar, biz de onun mesajını 409 cevabına çeviririz
    if (String(error?.message).includes("Oda bu tarihlerde dolu")) {
      throw hata("Oda bu tarihlerde dolu", 409);
    }
    throw error;
  }
};

export { rezervasyonOlustur };
