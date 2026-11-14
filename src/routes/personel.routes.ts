import { Router } from 'express';
import { personelListele, personelEkle, personelGuncelle, personelSil } from '../controllers/personel.controller';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';

const router = Router();

router.get("/", tokenControl, roleControl(['yonetici']), personelListele);
router.post("/", tokenControl, roleControl(['yonetici']), personelEkle);
router.put("/:id", tokenControl, roleControl(['yonetici']), personelGuncelle);
router.delete("/:id", tokenControl, roleControl(['yonetici']), personelSil);

export default router;

