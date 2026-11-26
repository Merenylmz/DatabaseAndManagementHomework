import { NextFunction, Request, Response } from "express";
import * as raporService from "../services/rapor.service";
import { ApiResponse } from "../utils/ApiResponse";
import { aylikRaporSchema } from "../dtos/rapor.dto";

const odaDurumlari = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const veriler = await raporService.odaDurumlari();
    res.status(200).json(ApiResponse.success("Oda durumları listelendi", veriler));
  } catch (error) {
    next(error);
  }
};

// GET isteğinde veri adreste gelir, validate sadece body'ye baktığı için şemayı burada çalıştırıyoruz
const aylikRapor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { yil, ay } = aylikRaporSchema.parse(req.query);
    const rapor = await raporService.aylikRapor(yil, ay);
    res.status(200).json(ApiResponse.success("Aylık rapor hazırlandı", rapor));
  } catch (error) {
    next(error);
  }
};

export { odaDurumlari, aylikRapor };
