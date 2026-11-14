import { Request, Response } from 'express';
import * as personelService from '../services/personal.service';

const personelListele = async(req: Request, res:Response) =>{
    try {
        const data = await personelService.personelleriGetir();
        res.status(200).json({veri:data, status: true});
    } catch (error: any) {
        res.status(500).json({error: error.message, status: false});
    }
    
}

const personelEkle = async(req: Request, res:Response) =>{
    try {
        const data = await personelService.personelEkle(req.body);
        res.status(201).json({veri:data, status: true});
    } catch (error: any) {
        res.status(400).json({error: error.message, status: false});
    }
    
}

const personelGuncelle = async(req: Request, res:Response) =>{
    try {
        const id = parseInt((req.params as any).id);
        const data = await personelService.personelGuncelle(id, req.body);
        res.status(200).json({veri:data, status: true});
    } catch (error: any) {
        res.status(400).json({error: error.message, status: false});
    }
    
}

const personelSil = async(req: Request, res:Response) =>{
    try {
        const id = parseInt((req.params as any).id);
        await personelService.personelSil(id);
        res.status(200).json({status: true});
    } catch (error: any) {
        res.status(500).json({error: error.message, status: false});
    }
}


export {personelListele, personelEkle, personelGuncelle, personelSil};

