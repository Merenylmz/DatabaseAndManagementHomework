import { Router } from 'express';
import { tokenControl, roleControl } from '../middlewares/auth.middleware';
import { girisYap, kayitOl } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { girisYapSchema, kayitOlSchema } from '../dtos/auth.dto';

const router = Router();

router.post('/login', validate(girisYapSchema), girisYap);
router.post('/giris', validate(girisYapSchema), girisYap);

router.post('/register', validate(kayitOlSchema), kayitOl);
router.post('/kayit', validate(kayitOlSchema), kayitOl);

export default router;