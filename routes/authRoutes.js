const { Router } = require('express');
const passport = require('passport');
const { register, login, verify, resendCode, logout } = require('../controllers/authController');

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);       // Uses session-based login
router.post('/verify', verify);
router.post('/resend-code', resendCode);
router.post('/logout', logout);     // Logs out and destroys session

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL || 'http://localhost:3000' }),
    (req, res) => {
        // Successful login, redirect to dashboard
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
    }
);

module.exports = router;
