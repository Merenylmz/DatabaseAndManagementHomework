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

export {gunlukResepsiyonIslemleriniGetir, checkInService};