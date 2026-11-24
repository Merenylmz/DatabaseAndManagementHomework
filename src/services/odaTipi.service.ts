import prisma from "../config/dbPrisma";
import { OdaTipiEkle, OdaTipiGuncelle } from "../dtos/odaTipi.dto";

// errorHandler, hatadaki statusCode'a bakarak cevap kodunu seçer
const hata = (mesaj: string, statusCode: number) => Object.assign(new Error(mesaj), { statusCode });

const odaTipiBul = async (id: number) => {
  if (!Number.isInteger(id) || id <= 0) throw hata("Geçersiz id", 400);
  const odaTipi = await prisma.odaTipi.findUnique({ where: { id } });
  if (!odaTipi) throw hata("Oda tipi bulunamadı", 404);
  return odaTipi;
};

const odaTipleriniGetir = async () => {
  return await prisma.odaTipi.findMany({ orderBy: { id: "asc" } });
};

const odaTipiEkle = async (veri: OdaTipiEkle) => {
  return await prisma.odaTipi.create({ data: veri });
};

const odaTipiGuncelle = async (id: number, veri: OdaTipiGuncelle) => {
  await odaTipiBul(id);
  return await prisma.odaTipi.update({ where: { id }, data: veri });
};

const odaTipiSil = async (id: number) => {
  await odaTipiBul(id);

  // Bu tipe bağlı oda varsa silmeye izin verme
  const odaSayisi = await prisma.oda.count({ where: { oda_tipi_id: id } });
  if (odaSayisi > 0) throw hata(`Bu oda tipine bağlı ${odaSayisi} oda var, önce onları silin`, 409);

  // Sezon fiyatları bu tipe ait, onlarla birlikte tek transaction'da sil
  const [, silinen] = await prisma.$transaction([
    prisma.sezonFiyati.deleteMany({ where: { oda_tipi_id: id } }),
    prisma.odaTipi.delete({ where: { id } }),
  ]);
  return silinen;
};

export { odaTipleriniGetir, odaTipiEkle, odaTipiGuncelle, odaTipiSil };
