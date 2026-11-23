import { Router } from 'express';
import { kendiProfiliniGetir, kendiProfiliniGuncelle, misafirleriListele, yoneticiGuncelle, yoneticiSil} from '../controllers/misafir.controller';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profil', tokenControl, roleControl(['misafir', 'yonetici']), kendiProfiliniGetir);
router.put('/profil', tokenControl, roleControl(['misafir', 'yonetici']), kendiProfiliniGuncelle);


router.get('/', tokenControl, roleControl(['yonetici']), misafirleriListele);
router.put('/:id', tokenControl, roleControl(['yonetici']), yoneticiGuncelle);
router.delete('/:id', tokenControl, roleControl(['yonetici']), yoneticiSil);

export default router;