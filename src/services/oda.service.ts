import { Prisma } from "@prisma/client";
import prisma from "../config/dbPrisma";
import { OdaEkle, OdaGuncelle } from "../dtos/oda.dto";
import { fonksiyonCagir } from "../utils/sqlCagir";

// bos_odalar fonksiyonunun döndürdüğü satırın şekli
type BosOda = {
  oda_id: number;
  oda_numarasi: string;
  kat: number;
  oda_tipi: string;
  kapasite: number;
  temel_fiyat: Prisma.Decimal;
};

const hata = (mesaj: string, statusCode: number) => Object.assign(new Error(mesaj), { statusCode });

const odaBul = async (id: number) => {
  if (!Number.isInteger(id) || id <= 0) throw hata("Geçersiz id", 400);
  const oda = await prisma.oda.findUnique({ where: { id } });
  if (!oda) throw hata("Oda bulunamadı", 404);
  return oda;
};

// Eklemede ve güncellemede aynı iki kontrol gerekiyor
const kontrolEt = async (veri: OdaGuncelle, haricId?: number) => {
  if (veri.oda_tipi_id !== undefined) {
    const odaTipi = await prisma.odaTipi.findUnique({ where: { id: veri.oda_tipi_id } });
    if (!odaTipi) throw hata("Seçilen oda tipi bulunamadı", 400);
  }
  if (veri.oda_numarasi !== undefined) {
    const ayniNumara = await prisma.oda.findUnique({ where: { oda_numarasi: veri.oda_numarasi } });
    if (ayniNumara && ayniNumara.id !== haricId) throw hata("Bu oda numarası zaten kullanılıyor", 409);
  }
};

const odalariGetir = async () => {
  return await prisma.oda.findMany({
    orderBy: { oda_numarasi: "asc" },
    include: { oda_tipi: { select: { ad: true } } },
  });
};

const odaEkle = async (veri: OdaEkle) => {
  await kontrolEt(veri);
  return await prisma.oda.create({ data: veri });
};

const odaGuncelle = async (id: number, veri: OdaGuncelle) => {
  await odaBul(id);
  await kontrolEt(veri, id);
  return await prisma.oda.update({ where: { id }, data: veri });
};

const odaSil = async (id: number) => {
  await odaBul(id);

  // Geçmiş kayıtları kaybetmemek için rezervasyonu veya temizlik kaydı olan oda silinmez
  const rezervasyonSayisi = await prisma.rezervasyon.count({ where: { oda_id: id } });
  const temizlikSayisi = await prisma.temizlik_Kaydi.count({ where: { oda_id: id } });
  if (rezervasyonSayisi + temizlikSayisi > 0) {
    throw hata("Bu odanın rezervasyon veya temizlik kaydı var, silinemez. Gerekirse durumunu 'bakimda' yapın", 409);
  }

  return await prisma.oda.delete({ where: { id } });
};

const bosOdalariAra = async (giris: string, cikis: string, odaTipiId?: number) => {
  return await fonksiyonCagir<BosOda>("bos_odalar", [
    Prisma.sql`${giris}::date`,
    Prisma.sql`${cikis}::date`,
    Prisma.sql`${odaTipiId ?? null}::int`,
  ]);
};

export { odalariGetir, odaEkle, odaGuncelle, odaSil, bosOdalariAra };
