import { Router } from 'express';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';
import { bugunkuHareketleriGetir, checkInYap, ekHizmetEkle_resepsiyon, temizlikEkle } from '../controllers/resepsiyon.controller';

const router = Router();
router.get('/bugunku-hareketler', tokenControl, roleControl(['resepsiyon', 'yonetici']), bugunkuHareketleriGetir);
router.post('/check-in', tokenControl, roleControl(['resepsiyon', 'yonetici']), checkInYap);

router.post('/ek-hizmet', tokenControl, roleControl(['resepsiyon', 'yonetici']), ekHizmetEkle_resepsiyon);
router.post('/temizlik', tokenControl, roleControl(['resepsiyon', 'yonetici']), temizlikEkle);

export default router;