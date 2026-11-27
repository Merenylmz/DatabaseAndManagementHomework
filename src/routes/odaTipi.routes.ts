import { Router } from "express";
import { odaTipiEkle, odaTipiGuncelle, odaTipiSil, odaTipleriniListele } from "../controllers/odaTipi.controller";
import { tokenControl, roleControl } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { odaTipiEkleSchema, odaTipiGuncelleSchema } from "../dtos/odaTipi.dto";

const router = Router();

// Listelemeyi herkes görebilir, değiştirmeyi sadece yönetici yapar
router.get("/", odaTipleriniListele);
router.post("/", tokenControl, roleControl(["yonetici"]), validate(odaTipiEkleSchema), odaTipiEkle);
router.put("/:id", tokenControl, roleControl(["yonetici"]), validate(odaTipiGuncelleSchema), odaTipiGuncelle);
router.delete("/:id", tokenControl, roleControl(["yonetici"]), odaTipiSil);

export default router;
