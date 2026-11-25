import { Prisma } from "@prisma/client";
import prisma from "../config/dbPrisma";

// Ad gelir ama sadece harf, rakam ve _ kabul edilir
const adKontrol = (ad: string) => {
  if (!/^[a-z_][a-z0-9_]*$/.test(ad)) throw new Error("Geçersiz SQL nesne adı");
};

export const fonksiyonCagir = async <T>(ad: string, parametreler: Prisma.Sql[]) => {
  adKontrol(ad);
  return prisma.$queryRaw<T[]>`SELECT * FROM ${Prisma.raw(ad)}(${Prisma.join(parametreler)})`;
};

export const viewOku = async <T>(ad: string) => {
  adKontrol(ad);
  return prisma.$queryRaw<T[]>`SELECT * FROM ${Prisma.raw(ad)}`;
};