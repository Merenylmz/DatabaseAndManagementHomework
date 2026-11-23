import { Request, Response } from 'express';
import {checkInService, gunlukResepsiyonIslemleriniGetir} from '../services/resepsiyon.service';
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

export {bugunkuHareketleriGetir, checkInYap};