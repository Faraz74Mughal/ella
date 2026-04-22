import { Router } from 'express';
import { login, register, logout, refreshAccessToken, forgotPassword, resetPassword, resendVerification, googleLogin, getCurrentUser, assignRole, verifyEmail } from '../controllers/auth.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/me', verifyJWT, getCurrentUser);
router.post('/register', register); // (Keep your existing validation middleware here)
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.post('/resend-verification', resendVerification);
router.post('/google-login', googleLogin);
router.post('/assign-role', assignRole);
router.get('/verify-email/:token', verifyEmail);
// Secure routes
router.post('/logout', verifyJWT, logout);

export default router;
