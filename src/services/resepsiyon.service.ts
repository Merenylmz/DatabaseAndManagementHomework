import { $Enums, OdemeTuru, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gunlukResepsiyonIslemleriniGetir = async() => {
    return await prisma.$queryRaw`SELECT * FROM vw_bugunku_hareketler`;
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

const checkOutService = async(konaklamaId: Number, odemeTuru: OdemeTuru) =>{
    const validPaymentTypes: OdemeTuru[] = ['nakit','havale','kredi_karti'];
    if (!validPaymentTypes.includes(odemeTuru)) {
        throw new Error('Geçersiz Ödeme Türü. (Nakit, Havale/ EFT veya Kredi Kartı)');        
    }

    return await prisma.$transaction(async(tx)=>{
        const accomodation = await tx.konaklama.findUnique({
            where: {id: Number(konaklamaId)},
            include: {rezervasyon: true}
        });

        if (!accomodation) {
            throw new Error('Konaklama kaydı bulunamadı.');
        }

        if (accomodation.gerceklesen_cikis !== null) {
            throw new Error('Bu konaklama için zaten check-out yapılmış.');
        }

        const result = await tx.$queryRaw<{toplam_tutar: any}[]>`
            SELECT fn_konaklama_toplam_tutar(${konaklamaId}::int) AS toplam_tutar
        `;
        const totalAmount = Number(result[0].toplam_tutar ?? 0);

        const updatedAccomodation = await tx.konaklama.update({
            where: {id: Number(konaklamaId)},
            data: {
                gerceklesen_cikis: new Date()
            }
        });

        const payment = await tx.odeme.create({
            data: {
                konaklama_id: Number(konaklamaId),
                tutar: totalAmount,
                odeme_turu: odemeTuru
            }
        });

        await tx.rezervasyon.update({
            where: {id: accomodation.rezervasyon_id},
            data:{
                durum: "tamamlandi"
            }
        });

        const updatedRoom = await tx.oda.update({
            where: {id: accomodation.rezervasyon.oda_id},
            data: {durum: 'temizlikte'}
        });

        return {
            konaklama: updatedAccomodation,
            hesaplanan_tutar: totalAmount,
            odeme: payment,
            oda: updatedRoom
        }
    });
}

export {gunlukResepsiyonIslemleriniGetir, checkInService, konaklamaHizmetEkle, temizlikKaydiEkle, checkOutService};