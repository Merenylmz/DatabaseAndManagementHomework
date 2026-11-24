import { Router } from "express";
import { odaEkle, odaGuncelle, odaSil, odalariListele } from "../controllers/oda.controller";
import { tokenControl, roleControl } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { odaEkleSchema, odaGuncelleSchema } from "../dtos/oda.dto";

const router = Router();

// Oda listesini resepsiyon ve yönetici görür, değiştirmeyi sadece yönetici yapar
router.get("/", tokenControl, roleControl(["resepsiyon", "yonetici"]), odalariListele);
router.post("/", tokenControl, roleControl(["yonetici"]), validate(odaEkleSchema), odaEkle);
router.put("/:id", tokenControl, roleControl(["yonetici"]), validate(odaGuncelleSchema), odaGuncelle);
router.delete("/:id", tokenControl, roleControl(["yonetici"]), odaSil);

export default router;
