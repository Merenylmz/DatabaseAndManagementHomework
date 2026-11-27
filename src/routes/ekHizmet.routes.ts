import { Router } from 'express';
import { ekHizmetEkle, ekHizmetGuncelle, ekHizmetSil, ekHizmetiListele } from '../controllers/ekHizmet.controller';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { ekHizmetEkleSchema } from '../dtos/ekhizmet.dto';

const router = Router();

router.get('/', ekHizmetiListele);
router.post('/', tokenControl,validate(ekHizmetEkleSchema), roleControl(['yonetici']), ekHizmetEkle);
router.put('/:id', tokenControl,validate(ekHizmetEkleSchema), roleControl(['yonetici']), ekHizmetGuncelle);
router.delete('/:id', tokenControl, roleControl(['yonetici']), ekHizmetSil);

export default router;