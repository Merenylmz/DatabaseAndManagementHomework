import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ekHizmetSetType = {ad: string, fiyat: number};

const ekHizmetleriGetir = async()=>{
    return await prisma.ek_Hizmet.findMany();
}


const ekHizmetEkle = async(dataset: ekHizmetSetType)=>{
    return await prisma.ek_Hizmet.create({
        data:{
            ad: dataset.ad,
            fiyat: dataset.fiyat
        }
    });
}


const ekHizmetGuncelle = async (id: number, dataset: ekHizmetSetType) => {
    const currentServices = await prisma.ek_Hizmet.findUnique({where:{id}});
    if (!currentServices) {throw new Error("Güncellenmek istenen hizmet bulunamadı")}

    return await prisma.ek_Hizmet.update({where:{id}, data: {
        dataset
    }});
}


const ekHizmetSil = async(id: number) =>{
    const currentServices = await prisma.ek_Hizmet.findUnique({where:{id}});
    if (!currentServices) {throw new Error("Güncellenmek istenen hizmet bulunamadı")}

    return await prisma.ek_Hizmet.delete({where: {id}});
}

export {ekHizmetleriGetir, ekHizmetEkle, ekHizmetGuncelle, ekHizmetSil};