import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from './auth.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validateRegistration, validateLogin } from '../../middleware/validators.js';

const router = Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;