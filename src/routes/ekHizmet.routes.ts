import { Router } from 'express';
import { ekHizmetEkle, ekHizmetGuncelle, ekHizmetSil, ekHizmetiListele } from '../controllers/ekHizmet.controller';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', ekHizmetiListele);
router.post('/', tokenControl, roleControl(['yonetici']), ekHizmetEkle);
router.put('/:id', tokenControl, roleControl(['yonetici']), ekHizmetGuncelle);
router.delete('/:id', tokenControl, roleControl(['yonetici']), ekHizmetSil);

export default router;