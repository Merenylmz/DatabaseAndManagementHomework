import {Request, Response} from "express";
import * as misafirService from '../services/misafir.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const misafirleriListele = async(req: AuthRequest, res: Response) => {
    try {
        const data = await misafirService.tumMisafirListele();
        res.status(200).json({data, status: true});
    } catch (error: any) {
        res.status(500).json({error: error.message, status: false})
    }
}

const yoneticiGuncelle = async(req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const updatedData = await misafirService.misafirGuncelle(id, req.body);
        res.status(200).json({updatedData, status: true});
    } catch (error: any) {
        res.status(400).json({error: error.message, status: false})
    }
}

const yoneticiSil = async(req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        await misafirService.misafirSil(id);
        res.status(200).json({status: true});
    } catch (error: any) {
        res.status(400).json({error: error.message, status: false})
    }
}

const kendiProfiliniGetir = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = await misafirService.profilBulKullaniciId(userId);
    
    if (!profile) return res.status(404).json({ hata: "Size ait bir misafir profili bulunamadı." });
    
    res.status(200).json({profile, status: true});
  } catch (error: any) { res.status(500).json({ error: error.message, status: false}); }
};

const kendiProfiliniGuncelle = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = await misafirService.profilBulKullaniciId(userId);
    
    if (!profile) return res.status(404).json({ hata: "Profil bulunamadı." });
    
    const updatedData = await misafirService.misafirGuncelle(profile.id, req.body);
    res.status(200).json({updatedData, status: true});
  } catch (error: any) { res.status(400).json({ error: error.message, status: false }); }
};

export {misafirleriListele, yoneticiGuncelle, yoneticiSil, kendiProfiliniGetir, kendiProfiliniGuncelle};