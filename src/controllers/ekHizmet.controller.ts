import { Request, Response } from 'express';
import * as ekHizmetService from '../services/ekHizmet.service';

const ekHizmetiListele = async(req: Request, res: Response) => {
    try {
        const data = await ekHizmetService.ekHizmetleriGetir();

        return res.status(200).json({status: true, veriler:data});
    } catch (error: any) {
        res.status(500).json({ error: error.message, status: false });
    }
};

const ekHizmetEkle = async(req: Request, res: Response) => {
    try {
        const newAdditionalService = await ekHizmetService.ekHizmetEkle(req.body);
        return res.status(201).json({status: true, yeniVeri:newAdditionalService});
    } catch (error: any) {
        return res.status(500).json({ error: error.message, status: false });
    }
}

const ekHizmetGuncelle = async (req: Request, res: Response) => {
  try {
    const id = parseInt((req.params.id) as string);
    const updatedData = await ekHizmetService.ekHizmetGuncelle(id, req.body);
    return res.status(200).json({guncellenenKayit: updatedData, status: false});
  } catch (error: any) {
    return res.status(500).json({ error: error.message, status: false });
  }
};

const ekHizmetSil = async (req: Request, res: Response) => {
  try {
    const id = parseInt((req.params.id) as string);
    await ekHizmetService.ekHizmetSil(id);
    return res.status(200).json({ status: true});
  } catch (error: any) {
    return res.status(500).json({ error: error.message, status: false });
  }
};


export {ekHizmetiListele, ekHizmetEkle, ekHizmetGuncelle, ekHizmetSil};