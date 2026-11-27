import { Prisma } from "@prisma/client";
import prisma from "../config/dbPrisma";
import { fonksiyonCagir, viewOku } from "../utils/sqlCagir";
import { IslemGecmisiFiltre } from "../dtos/rapor.dto";

// vw_oda_durumu view'ının döndürdüğü satırın şekli
type OdaDurumu = {
  oda_id: number;
  oda_numarasi: string;
  kat: number;
  oda_tipi: string;
  durum: string | null;
  son_temizlik: Date | null;
};

// aylik_rapor fonksiyonunun döndürdüğü satırın şekli
type AylikRapor = {
  toplam_oda: number;
  gun_sayisi: number;
  dolu_gece: number;
  doluluk_orani: Prisma.Decimal | null;
  gelir: Prisma.Decimal;
};

const odaDurumlari = async () => {
  const odalar = await viewOku<OdaDurumu>("vw_oda_durumu");
  return odalar.sort((a, b) => a.oda_numarasi.localeCompare(b.oda_numarasi, "tr", { numeric: true }));
};

const aylikRapor = async (yil: number, ay: number) => {
  const satirlar = await fonksiyonCagir<AylikRapor>("aylik_rapor", [Prisma.sql`${yil}::int`, Prisma.sql`${ay}::int`]);
  // Fonksiyon her zaman tek satır döner. NUMERIC değerler JSON'da yazı olarak gitmesin diye sayıya çevriliyor.
  const r = satirlar[0];
  return {
    yil,
    ay,
    toplam_oda: r.toplam_oda,
    gun_sayisi: r.gun_sayisi,
    dolu_gece: r.dolu_gece,
    doluluk_orani: Number(r.doluluk_orani ?? 0),
    gelir: Number(r.gelir),
  };
};

// Log tablosu hızla büyüdüğü için hepsini değil, istenen sayfayı en yeniden başlayarak getiriyoruz
const islemGecmisi = async ({ tablo, islem, sayfa, limit }: IslemGecmisiFiltre) => {
  const where = { tablo_adi: tablo, islem_turu: islem };
  const [kayitlar, toplam] = await prisma.$transaction([
    prisma.islem_Log.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (sayfa - 1) * limit,
      take: limit,
    }),
    prisma.islem_Log.count({ where }),
  ]);
  return { kayitlar, toplam, sayfa, limit, toplam_sayfa: Math.ceil(toplam / limit) };
};

export { odaDurumlari, aylikRapor, islemGecmisi };
