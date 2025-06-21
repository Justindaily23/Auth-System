import Router from 'express';
import { loginUser, logoutAllSessions, logoutUser, refreshAccessToken, registerUser } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.middleware.js';
import { loginSchema, registerSchema } from '../validation/auth.validation.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.post('/refresh_token', refreshAccessToken);
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Protected data', user: req.user });
});
router.post('/logout', authMiddleware, logoutUser);
router.post('/logout-all', authMiddleware, logoutAllSessions)

export default router;