import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rezervasyonlariGetir = async() => {
    return await prisma.$queryRaw`SELECT * FROM vw_bugunku_hareketlear`;
}

export {rezervasyonlariGetir};