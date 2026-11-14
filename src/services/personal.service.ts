import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const personelleriGetir = async()=>{
    return await prisma.personel.findMany();
}

const personelEkle = async(dataset: any)=>{
    return await prisma.personel.create({
        data: {
            ad: dataset.ad,
            soyad: dataset.soyad,
            gorev: dataset.gorev,
            kullanici_id: dataset.kullanici_id,
            ise_giris_tarihi: new Date()
        }
    });
}

const personelGuncelle = async(id:number, dataset: { ad?: string; soyad?: string; gorev?: string }) => {
    const currentPersonal = await prisma.personel.findUnique({where: {id}});
    if (!currentPersonal) {
        throw new Error("Personel Bulunamadı.");
    }

    return await prisma.personel.update({
        where: {id},
        data: dataset
    });
}

const personelSil = async(id:number) =>{
    const currentPersonel = await prisma.personel.findUnique({where: {id}});
    if (!currentPersonel) {
        throw new Error("Personel Bulunamadı");
    }

    return await prisma.personel.delete({
        where: {id}
    });
}

export {personelleriGetir, personelEkle, personelGuncelle, personelSil};