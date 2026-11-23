import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gunlukResepsiyonIslemleriniGetir = async() => {
    return await prisma.$queryRaw`SELECT * FROM vw_bugunku_hareketlear`;
}

const checkInService = async(rezervasyonId: number, kullaniciId: number, bodyPersonalId?: number) => {
    const reservation = await prisma.rezervasyon.findUnique({
        where: {id: rezervasyonId},
        include: {
            konaklamalar: true
        }
    });

    if (!reservation) {
        throw new Error('Rezervasyon Bulanamadı.');
    }
    if (reservation.durum != 'onayli') {
        throw new Error('Sadece Onaylı Rezervasyonlar Check-in işlemi yapılabilir.');
    }

    if (reservation.konaklamalar.length > 0) {
        throw new Error('Bu Rezervasyon için zaten Check-in işlemi yapılmış.');
    }

    const user = await prisma.kullanici.findUnique({
        where: {id: kullaniciId}
    });

    const personalId  = user?.personel_id ?? bodyPersonalId;
    if (!personalId) {
        throw new Error('İşlemi Yapılacak Personel bilgisi bulunamadı.');
    }

    return await prisma.konaklama.create({
        data: {
            rezervasyon_id: rezervasyonId,
            personel_id: personalId,
            gerceklesen_giris: new Date()
        },
        include: {
            rezervasyon: {
                include:{oda: true, misafir: true}
            }
        }
    });
}

const konaklamaHizmetEkle = async(konaklamaId: number, ekHizmetId: number, adet: number) => {

    if (adet <= 0) {
        throw new Error('Adet bilgisi en az 1 olmalıdır.');
    }

    const accomodation = await prisma.konaklama.findUnique({
        where: {id: konaklamaId}
    });

    if (!accomodation) {
        throw new Error('Konaklama Kaydı bulunamadı.');
    }

    if (accomodation.gerceklesen_cikis !== null) {
        throw new Error('Çıkışı Yapılmış bir konaklamaya ek hizmet eklenemez.');
    }

    const additionalService = await prisma.ek_Hizmet.findUnique({
        where: {id: ekHizmetId}
    });
    if (!additionalService) {
        throw new Error('Ek Hizmet Bulunamadı.');
    }

    return await prisma.konaklama_Hizmeti.create({
        data: {
            konaklama_id: accomodation.id,
            ek_hizmet_id: additionalService.id,
            adet,
        },
        include: {
            ek_hizmet: true
        }
    });
}
const temizlikKaydiEkle = async(odaId:number, kullaniciId: number, durum: string = 'Temizlendi', bodyPersonalId: number | undefined) => {

    const room = await prisma.oda.findUnique({where:{id: odaId}});
    if (!room) {
        throw new Error('Oda Bulunamadı.');
    }

    const user = await prisma.kullanici.findUnique({where: {id: kullaniciId}});
    if (!user) {
        throw new Error('Temizliği Yapan personel bulunamadı');
    }

    const registry = await prisma.temizlik_Kaydi.create({
        data: {
            oda_id: odaId,
            personel_id: kullaniciId,
            durum,
        },
        include: {
            oda: true,
            personel: true
        }
    });

    if (room.durum === 'temizlikte' && durum.toLowerCase().includes('temiz')) {
        await prisma.oda.update({
            where: {id: odaId},
            data: {durum: 'bos'}
        });
    }

    return registry;
}

export {gunlukResepsiyonIslemleriniGetir, checkInService, konaklamaHizmetEkle, temizlikKaydiEkle};