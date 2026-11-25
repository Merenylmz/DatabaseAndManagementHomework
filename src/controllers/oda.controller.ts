import { NextFunction, Request, Response } from "express";
import * as odaService from "../services/oda.service";
import { ApiResponse } from "../utils/ApiResponse";
import { bosOdaAraSchema } from "../dtos/oda.dto";

const odalariListele = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const veriler = await odaService.odalariGetir();
    res.status(200).json(ApiResponse.success("Odalar listelendi", veriler));
  } catch (error) {
    next(error);
  }
};

const odaEkle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const yeni = await odaService.odaEkle(req.body);
    res.status(201).json(ApiResponse.success("Oda eklendi", yeni));
  } catch (error) {
    next(error);
  }
};

const odaGuncelle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guncel = await odaService.odaGuncelle(Number(req.params.id), req.body);
    res.status(200).json(ApiResponse.success("Oda güncellendi", guncel));
  } catch (error) {
    next(error);
  }
};

const odaSil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await odaService.odaSil(Number(req.params.id));
    res.status(200).json(ApiResponse.success("Oda silindi"));
  } catch (error) {
    next(error);
  }
};

// GET isteğinde veri adreste gelir, validate sadece body'ye baktığı için şemayı burada çalıştırıyoruz
const bosOdalariAra = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { giris, cikis, odaTipiId } = bosOdaAraSchema.parse(req.query);
    const odalar = await odaService.bosOdalariAra(giris, cikis, odaTipiId);
    res.status(200).json(ApiResponse.success("Boş odalar listelendi", odalar));
  } catch (error) {
    next(error);
  }
};

export { odalariListele, odaEkle, odaGuncelle, odaSil, bosOdalariAra };
