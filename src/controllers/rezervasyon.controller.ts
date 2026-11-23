import { Request, Response } from 'express';
import {rezervasyonlariGetir} from '../services/rezervasyon.service';

const bugunkuHareketleriGetir = async(req: Request, res: Response) => {
    try {
        const list = await rezervasyonlariGetir();
        res.status(200).json({list, status: true});
    } catch (error) {
        res.status(500).json({status:false, message: error});
    }
}

export {bugunkuHareketleriGetir};