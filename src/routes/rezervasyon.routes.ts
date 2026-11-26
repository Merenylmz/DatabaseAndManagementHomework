import { Router } from "express";
import { rezervasyonOlustur } from "../controllers/rezervasyon.controller";
import { tokenControl, roleControl } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { rezervasyonEkleSchema } from "../dtos/rezervasyon.dto";

const router = Router();

router.post(
  "/",
  tokenControl,
  roleControl(["misafir", "resepsiyon", "yonetici"]),
  validate(rezervasyonEkleSchema),
  rezervasyonOlustur
);

export default router;
