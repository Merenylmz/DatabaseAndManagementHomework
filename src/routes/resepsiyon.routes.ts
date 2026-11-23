import { Router } from 'express';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';
import { bugunkuHareketleriGetir, checkInYap } from '../controllers/resepsiyon.controller';

const router = Router();
router.get('/bugunku-hareketler', tokenControl, roleControl(['resepsiyon', 'yonetici']), bugunkuHareketleriGetir);
router.post('/check-in', tokenControl, roleControl(['resepsiyon', 'yonetici']), checkInYap);


export default router;