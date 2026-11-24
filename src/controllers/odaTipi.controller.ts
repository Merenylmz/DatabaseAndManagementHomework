import { NextFunction, Request, Response } from "express";
import * as odaTipiService from "../services/odaTipi.service";
import { ApiResponse } from "../utils/ApiResponse";

// Hatalar next() ile ortak errorHandler'a gider
const odaTipleriniListele = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const veriler = await odaTipiService.odaTipleriniGetir();
    res.status(200).json(ApiResponse.success("Oda tipleri listelendi", veriler));
  } catch (error) {
    next(error);
  }
};

const odaTipiEkle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const yeni = await odaTipiService.odaTipiEkle(req.body);
    res.status(201).json(ApiResponse.success("Oda tipi eklendi", yeni));
  } catch (error) {
    next(error);
  }
};

const odaTipiGuncelle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guncel = await odaTipiService.odaTipiGuncelle(Number(req.params.id), req.body);
    res.status(200).json(ApiResponse.success("Oda tipi güncellendi", guncel));
  } catch (error) {
    next(error);
  }
};

const odaTipiSil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await odaTipiService.odaTipiSil(Number(req.params.id));
    res.status(200).json(ApiResponse.success("Oda tipi silindi"));
  } catch (error) {
    next(error);
  }
};

export { odaTipleriniListele, odaTipiEkle, odaTipiGuncelle, odaTipiSil };
