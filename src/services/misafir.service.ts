import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tumMisafirListele = async() => {
    return await prisma.misafir.findMany();
}

const misafirSil = async(id: number) => {
    return await prisma.misafir.delete({where: {id}});
}

const misafirGuncelle = async(id: number, dataset: any) => {
    return await prisma.misafir.update({where: {id}, data: dataset});
}

const profilBulKullaniciId = async(kullanicisiId: number) => {
    return await prisma.misafir.findFirst({where: {id: kullanicisiId} });
}
export {tumMisafirListele, misafirSil, misafirGuncelle, profilBulKullaniciId};