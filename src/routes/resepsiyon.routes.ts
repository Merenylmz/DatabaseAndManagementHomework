import { Router } from 'express';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';
import { bugunkuHareketleriGetir, checkInYap, checkOutYap, ekHizmetEkle_resepsiyon, temizlikEkle } from '../controllers/resepsiyon.controller';
import { checkInSchema, checkOutSchema, konaklamaHizmetEkleSchema, temizlikEkleSchema } from '../dtos/resepsiyon.dto';
import { validate } from '../middlewares/validate';

const router = Router();
router.get('/bugunku-hareketler', tokenControl, roleControl(['resepsiyon', 'yonetici']), bugunkuHareketleriGetir);
router.post('/check-in', tokenControl, validate(checkInSchema), roleControl(['resepsiyon', 'yonetici']), checkInYap);

router.post('/ek-hizmet', tokenControl,validate(konaklamaHizmetEkleSchema), roleControl(['resepsiyon', 'yonetici']), ekHizmetEkle_resepsiyon);
router.post('/temizlik', tokenControl, roleControl(['resepsiyon', 'yonetici']),validate(temizlikEkleSchema), temizlikEkle);

router.post('/check-out', tokenControl, roleControl(['resepsiyon', 'yonetici']), validate(checkOutSchema),checkOutYap);

export default router;