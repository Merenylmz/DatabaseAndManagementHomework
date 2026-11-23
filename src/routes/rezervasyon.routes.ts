import { Router } from 'express';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';
import { bugunkuHareketleriGetir } from '../controllers/rezervasyon.controller';

const router = Router();
router.get('/bugunku-hareketler', tokenControl, roleControl(['resepsiyon', 'yonetici']), bugunkuHareketleriGetir);

export default router;