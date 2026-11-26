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

export { rezervasyonOlustur };
