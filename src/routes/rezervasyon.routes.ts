import { Router } from "express";
import {
  rezervasyonOlustur,
  rezervasyonIptal,
  rezervasyonlarim,
  gecmisKonaklamalar,
} from "../controllers/rezervasyon.controller";
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

// Bu iki liste giriş yapan misafirin kendi kayıtlarıdır
router.get("/benim", tokenControl, roleControl(["misafir"]), rezervasyonlarim);
router.get("/gecmis", tokenControl, roleControl(["misafir"]), gecmisKonaklamalar);

router.patch("/:id/iptal", tokenControl, roleControl(["misafir", "resepsiyon", "yonetici"]), rezervasyonIptal);

export default router;
