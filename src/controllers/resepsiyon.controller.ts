import { Request, Response } from 'express';
import {checkInService, gunlukResepsiyonIslemleriniGetir, konaklamaHizmetEkle, temizlikKaydiEkle} from '../services/resepsiyon.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const bugunkuHareketleriGetir = async(req: Request, res: Response) => {
    try {
        const list = await gunlukResepsiyonIslemleriniGetir();
        res.status(200).json({list, status: true});
    } catch (error) {
        res.status(500).json({status:false, message: error});
    }
}

const checkInYap = async(req: AuthRequest, res: Response) =>{
    try {
        const {rezervasyon_id, personel_id} = req.body;
        if (!rezervasyon_id) {
            return res.status(400).json({
                error: "Rezervasyon id alanı verilmesi zorunludur.",
                status: false
            });
        }

        const konaklama = await checkInService(Number(rezervasyon_id), req.user.id, personel_id ? Number(personel_id):undefined);

        res.status(201).json({
            konaklama,
            message: 'Check-in işlemi Başarıyla Tamamlanmıştır.',
            status: true
        });
    } catch (error) {
        res.status(400).json({
            message: error,
            status: false
        });
    }
}

const ekHizmetEkle_resepsiyon = async(req: Request, res: Response) => {
    try {
        const { konaklama_id, ek_hizmet_id, adet } = req.body;
        if (!konaklama_id || !ek_hizmet_id || !adet) {
            return res.status(400).json({
                message: 'konaklama_id, ek_hizmet_id ve adet alanları zorunludur.',
                status: false
            });
        }

        const registry = await konaklamaHizmetEkle(Number(konaklama_id), Number(ek_hizmet_id), Number(adet));

        res.status(201).json({
            message: 'Ek Hizmet Konaklamaya eklendi.',
            kayit:registry
        });
    } catch (error: any) {
        res.status(400).json({
            error: error.message,
            status: false
        });
    }
};

const temizlikEkle = async(req: AuthRequest, res: Response) => {
    try {
        const { oda_id, durum, personel_id } = req.body;

        if (!oda_id) {
            return res.status(400).json({ error: 'oda_id alanı zorunludur.', status: false });
        }

        const registry = await temizlikKaydiEkle(Number(oda_id), req.user.id, durum || 'Temizlendi', personel_id ? Number(personel_id) : undefined);

        res.status(201).json({
            message: 'Temizlik kaydı oluşturuldu.',
            status:true,
            kayit: registry
        });

    } catch (error: any) {
        res.status(400).json({
            error: error.message,
            status: false
        });
    }
};

export {bugunkuHareketleriGetir, checkInYap, ekHizmetEkle_resepsiyon, temizlikEkle};