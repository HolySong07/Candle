import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { logout } from '../controllers/authController.js';

import {
	validateRegisterInput,
	validateLoginInput,
} from '../middleware/ValidationHandlerMiddleware.js';
import rateLimiter from 'express-rate-limit';
import { verifyCaptcha } from '../middleware/verifyCaptcha.js';

const router = Router();

const apiLimiter = rateLimiter({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 50,
	message: { msg: 'IP rate limit exceeded, retry in 15 minutes.' },
});

router.post(
	'/register',
	apiLimiter,
	validateRegisterInput,
	verifyCaptcha,
	register
);
router.post('/login', apiLimiter, validateLoginInput, verifyCaptcha, login);
router.get('/logout', logout);

export default router;
