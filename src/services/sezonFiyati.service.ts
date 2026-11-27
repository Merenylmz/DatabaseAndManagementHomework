import prisma from "../config/dbPrisma";
import { SezonFiyatiEkle, SezonFiyatiGuncelle } from "../dtos/sezonFiyati.dto";

const hata = (mesaj: string, statusCode: number) => Object.assign(new Error(mesaj), { statusCode });

const sezonFiyatiBul = async (id: number) => {
  if (!Number.isInteger(id) || id <= 0) throw hata("Geçersiz id", 400);
  const sezonFiyati = await prisma.sezonFiyati.findUnique({ where: { id } });
  if (!sezonFiyati) throw hata("Sezon fiyatı bulunamadı", 404);
  return sezonFiyati;
};

// Eklemede ve güncellemede kaydın son hâli bu kurallara uymalı
const kontrolEt = async (veri: SezonFiyatiEkle, haricId?: number) => {
  const odaTipi = await prisma.odaTipi.findUnique({ where: { id: veri.oda_tipi_id } });
  if (!odaTipi) throw hata("Seçilen oda tipi bulunamadı", 400);

  if (veri.bitis_tarihi < veri.baslangic_tarihi) {
    throw hata("Bitiş tarihi başlangıç tarihinden önce olamaz", 400);
  }

  // Aynı oda tipinde tarihleri kesişen başka sezon olursa bir gecenin iki fiyatı olur
  const cakisan = await prisma.sezonFiyati.findFirst({
    where: {
      oda_tipi_id: veri.oda_tipi_id,
      id: haricId ? { not: haricId } : undefined,
      baslangic_tarihi: { lte: veri.bitis_tarihi },
      bitis_tarihi: { gte: veri.baslangic_tarihi },
    },
  });
  if (cakisan) {
    const gun = (t: Date) => t.toISOString().slice(0, 10);
    throw hata(`Bu tarihler başka bir sezonla çakışıyor (${gun(cakisan.baslangic_tarihi)} / ${gun(cakisan.bitis_tarihi)})`, 409);
  }
};

const sezonFiyatlariniGetir = async (odaTipiId?: number) => {
  return await prisma.sezonFiyati.findMany({
    where: odaTipiId ? { oda_tipi_id: odaTipiId } : undefined,
    orderBy: [{ oda_tipi_id: "asc" }, { baslangic_tarihi: "asc" }],
    include: { oda_tipi: { select: { ad: true } } },
  });
};

const sezonFiyatiEkle = async (veri: SezonFiyatiEkle) => {
  await kontrolEt(veri);
  return await prisma.sezonFiyati.create({ data: veri });
};

const sezonFiyatiGuncelle = async (id: number, veri: SezonFiyatiGuncelle) => {
  const mevcut = await sezonFiyatiBul(id);

  // Sadece bitiş tarihi gelse bile eski başlangıçla birlikte kontrol edilmeli
  await kontrolEt(
    {
      oda_tipi_id: veri.oda_tipi_id ?? mevcut.oda_tipi_id,
      baslangic_tarihi: veri.baslangic_tarihi ?? mevcut.baslangic_tarihi,
      bitis_tarihi: veri.bitis_tarihi ?? mevcut.bitis_tarihi,
      gecelik_fiyat: veri.gecelik_fiyat ?? Number(mevcut.gecelik_fiyat),
    },
    id
  );
  return await prisma.sezonFiyati.update({ where: { id }, data: veri });
};

const sezonFiyatiSil = async (id: number) => {
  await sezonFiyatiBul(id);
  return await prisma.sezonFiyati.delete({ where: { id } });
};

export { sezonFiyatlariniGetir, sezonFiyatiEkle, sezonFiyatiGuncelle, sezonFiyatiSil };
