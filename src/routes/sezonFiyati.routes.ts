import { Router } from "express";
import {
  sezonFiyatiEkle,
  sezonFiyatiGuncelle,
  sezonFiyatiSil,
  sezonFiyatlariniListele,
} from "../controllers/sezonFiyati.controller";
import { tokenControl, roleControl } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { sezonFiyatiEkleSchema, sezonFiyatiGuncelleSchema } from "../dtos/sezonFiyati.dto";

const router = Router();

// Fiyatları resepsiyon ve yönetici görür, değiştirmeyi sadece yönetici yapar
router.get("/", tokenControl, roleControl(["resepsiyon", "yonetici"]), sezonFiyatlariniListele);
router.post("/", tokenControl, roleControl(["yonetici"]), validate(sezonFiyatiEkleSchema), sezonFiyatiEkle);
router.put("/:id", tokenControl, roleControl(["yonetici"]), validate(sezonFiyatiGuncelleSchema), sezonFiyatiGuncelle);
router.delete("/:id", tokenControl, roleControl(["yonetici"]), sezonFiyatiSil);

export default router;
