import { Router } from 'express';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';
import { girisYap, kayitOl } from '../controllers/auth.controller';

const router = Router();

router.post('/login', girisYap);
router.post('/giris', girisYap);

router.post('/register', kayitOl);
router.post('/kayit', kayitOl);

export default router;