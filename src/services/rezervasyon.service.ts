import prisma from "../config/dbPrisma";
import { RezervasyonEkle } from "../dtos/rezervasyon.dto";

const hata = (mesaj: string, statusCode: number) => Object.assign(new Error(mesaj), { statusCode });

// Token'da sadece kullanıcı id'si var, misafir id'sini kullanici tablosundan buluyoruz
const kendiMisafirId = async (kullaniciId: number) => {
  const kullanici = await prisma.kullanici.findUnique({ where: { id: kullaniciId } });
  if (!kullanici?.misafir_id) throw hata("Bu hesaba bağlı misafir kaydı yok", 400);
  return kullanici.misafir_id;
};

// Misafir kendi adına rezervasyon yapar, resepsiyon ve yönetici misafir_id göndermek zorunda
const misafirIdBul = async (kullaniciId: number, rol: string, gelenMisafirId?: number) => {
  if (rol === "misafir") return await kendiMisafirId(kullaniciId);

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

// Kayıt silinmez, durumu "iptal" olur. Böylece geçmiş ve log korunur.
const rezervasyonIptal = async (id: number, kullaniciId: number, rol: string) => {
  if (!Number.isInteger(id) || id <= 0) throw hata("Geçersiz id", 400);

  const rezervasyon = await prisma.rezervasyon.findUnique({
    where: { id },
    include: { _count: { select: { konaklamalar: true } } },
  });
  if (!rezervasyon) throw hata("Rezervasyon bulunamadı", 404);

  // Misafir sadece kendi rezervasyonunu iptal edebilir
  if (rol === "misafir" && rezervasyon.misafir_id !== (await kendiMisafirId(kullaniciId))) {
    throw hata("Bu rezervasyon size ait değil", 403);
  }

  if (rezervasyon.durum === "iptal") throw hata("Rezervasyon zaten iptal edilmiş", 409);
  if (rezervasyon.durum === "tamamlandi") throw hata("Tamamlanmış rezervasyon iptal edilemez", 409);
  if (rezervasyon._count.konaklamalar > 0) throw hata("Check-in yapılmış rezervasyon iptal edilemez", 409);

  return await prisma.rezervasyon.update({ where: { id }, data: { durum: "iptal" } });
};

const rezervasyonlarim = async (kullaniciId: number) => {
  const misafirId = await kendiMisafirId(kullaniciId);
  return await prisma.rezervasyon.findMany({
    where: { misafir_id: misafirId },
    orderBy: { giris_tarihi: "desc" },
    include: { oda: { select: { oda_numarasi: true, oda_tipi: { select: { ad: true } } } } },
  });
};

// Çıkışı yapılmış konaklamalar, ödemeleri ve aldığı ek hizmetlerle birlikte
const gecmisKonaklamalar = async (kullaniciId: number) => {
  const misafirId = await kendiMisafirId(kullaniciId);
  return await prisma.konaklama.findMany({
    where: { rezervasyon: { misafir_id: misafirId }, gerceklesen_cikis: { not: null } },
    orderBy: { gerceklesen_giris: "desc" },
    select: {
      id: true,
      gerceklesen_giris: true,
      gerceklesen_cikis: true,
      rezervasyon: {
        select: {
          id: true,
          kisi_sayisi: true,
          oda: { select: { oda_numarasi: true, oda_tipi: { select: { ad: true } } } },
        },
      },
      konaklama_hizmeti: { select: { adet: true, ek_hizmet: { select: { ad: true, fiyat: true } } } },
      odemeler: { select: { tutar: true, odeme_turu: true, tarih: true } },
    },
  });
};

export { rezervasyonOlustur, rezervasyonIptal, rezervasyonlarim, gecmisKonaklamalar };
