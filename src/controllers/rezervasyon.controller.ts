import { NextFunction, Response } from "express";
import * as rezervasyonService from "../services/rezervasyon.service";
import { ApiResponse } from "../utils/ApiResponse";
import { AuthRequest } from "../middlewares/auth.middleware";

const rezervasyonOlustur = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const yeni = await rezervasyonService.rezervasyonOlustur(req.body, req.user.id, req.user.rol);
    res.status(201).json(ApiResponse.success("Rezervasyon oluşturuldu", yeni));
  } catch (error) {
    next(error);
  }
};

const rezervasyonIptal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const iptal = await rezervasyonService.rezervasyonIptal(Number(req.params.id), req.user.id, req.user.rol);
    res.status(200).json(ApiResponse.success("Rezervasyon iptal edildi", iptal));
  } catch (error) {
    next(error);
  }
};

const rezervasyonlarim = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const veriler = await rezervasyonService.rezervasyonlarim(req.user.id);
    res.status(200).json(ApiResponse.success("Rezervasyonlarınız listelendi", veriler));
  } catch (error) {
    next(error);
  }
};

const gecmisKonaklamalar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const veriler = await rezervasyonService.gecmisKonaklamalar(req.user.id);
    res.status(200).json(ApiResponse.success("Geçmiş konaklamalarınız listelendi", veriler));
  } catch (error) {
    next(error);
  }
};

export { rezervasyonOlustur, rezervasyonIptal, rezervasyonlarim, gecmisKonaklamalar };
