import { Router } from "express";
import { odaDurumlari, aylikRapor } from "../controllers/rapor.controller";
import { tokenControl, roleControl } from "../middlewares/auth.middleware";

const router = Router();

// Oda durumunu resepsiyon da görür, gelir raporunu sadece yönetici görür
router.get("/oda-durumu", tokenControl, roleControl(["resepsiyon", "yonetici"]), odaDurumlari);
router.get("/aylik", tokenControl, roleControl(["yonetici"]), aylikRapor);

export default router;
