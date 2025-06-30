import Router from 'express';
import { forgotPassword, loginUser, logoutAllSessions, logoutUser, refreshAccessToken, registerUser, resetPassword } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.middleware.js';
import { loginSchema, registerSchema } from '../validation/auth.validation.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import passport from 'passport';
import {generateJwt} from '../utils/jwt.js';
import { getEnvironmentalVariable } from '../config/envConfig.js';

const router = Router();

/**
 * @route POST /api/auth/user/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', validateRequest(registerSchema), registerUser);

/**
 * @route POST /api/auth/user/login
 * @description Login user and generate access token and refresh token
 * @access Public
 */
router.post('/login', validateRequest(loginSchema), loginUser);

/**
 * @route POST /api/auth/user/refresh_token
 * @description Refresh access token using refresh token
 * @access Private
 * @note This route is protected by authMiddleware to ensure the user is authenticated.
 */
router.post('/refresh_token', refreshAccessToken);

/**
 * @route GET /api/auth/user/me
 * @description Get the authenticated user's data
 * @access Private
 * @note This route is protected by authMiddleware to ensure the user is authenticated.
 */
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Protected data', user: req.user });
});

/**
 * @route POST /api/auth/user/logout
 * @description Logout user by invalidating the refresh token
 * @access Private
 * @note This route is protected by authMiddleware to ensure the user is authenticated.
 */
router.post('/logout', authMiddleware, logoutUser);

/** * @route POST /api/auth/user/logout-all
 * @description Logout user from all sessions by invalidating all refresh tokens
 * @access Private
 * @note This route is protected by authMiddleware to ensure the user is authenticated.
 */
router.post('/logout-all', authMiddleware, logoutAllSessions)

/**
 * @route GET /api/auth/user-dashboard
 * @description Get user dashboard data
 * @access Private
 * @note This route is protected by authMiddleware and authorizeRoles to ensure the user has the 'user' role.
 */ 
router.get('/user-dashboard', authMiddleware, authorizeRoles('user'), (req, res) => {
  res.status(200).json({ message: 'Dashboard data', user: req.user });
});

/**
 * @route  GET /api/auth/user/admin-dashboard
 * @description Get admin dashboard data
 * @access Private
 * @note This route is protected by authMiddleware and authorizeRoles to ensure the user has the 'admin' role.
 */     
router.get('/admin-dashboard', authMiddleware, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({ message: 'Dashboard data', user: req.user });
});

/**
 * @route POST /api/auth/user/forgot-password
 * @description Initiate password reset process by emailing a reset link
 * @access Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route POST /api/auth/user/reset-password
 * @description Reset user password using a reset token
 * @access Public
 * @note This route is not implemented in the provided code, but typically it would handle password
 */
router.post('/reset-password', resetPassword);

// Trigger Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),

// Successful authentication, redirect home or to a specific route
(req, res) => {
    const token = generateJwt(req.user);
    const user = req.user; // The user object returned by the Google strategy
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: getEnvironmentalVariable('NODE_ENV') === 'production', // Set secure flag in production
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'Strict', 
    });
    
    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        auth_provider: user.auth_provider,
      },
    });
  }
  
  )
export default router;