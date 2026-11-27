import { NextFunction, Request, Response } from "express";
import * as sezonFiyatiService from "../services/sezonFiyati.service";
import { ApiResponse } from "../utils/ApiResponse";

// İstenirse ?oda_tipi_id=1 ile tek bir oda tipinin fiyatları listelenir
const sezonFiyatlariniListele = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const odaTipiId = req.query.oda_tipi_id ? Number(req.query.oda_tipi_id) : undefined;
    const veriler = await sezonFiyatiService.sezonFiyatlariniGetir(odaTipiId);
    res.status(200).json(ApiResponse.success("Sezon fiyatları listelendi", veriler));
  } catch (error) {
    next(error);
  }
};

const sezonFiyatiEkle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const yeni = await sezonFiyatiService.sezonFiyatiEkle(req.body);
    res.status(201).json(ApiResponse.success("Sezon fiyatı eklendi", yeni));
  } catch (error) {
    next(error);
  }
};

const sezonFiyatiGuncelle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guncel = await sezonFiyatiService.sezonFiyatiGuncelle(Number(req.params.id), req.body);
    res.status(200).json(ApiResponse.success("Sezon fiyatı güncellendi", guncel));
  } catch (error) {
    next(error);
  }
};

const sezonFiyatiSil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await sezonFiyatiService.sezonFiyatiSil(Number(req.params.id));
    res.status(200).json(ApiResponse.success("Sezon fiyatı silindi"));
  } catch (error) {
    next(error);
  }
};

export { sezonFiyatlariniListele, sezonFiyatiEkle, sezonFiyatiGuncelle, sezonFiyatiSil };
