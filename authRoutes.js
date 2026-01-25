const { Router } = require('express');
const { register, login, verify, resendCode } = require('../controllers/authController');
const passport = require('passport');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify);
router.post('/resend-code', resendCode);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
    (req, res) => {
        res.redirect('http://localhost:3000/dashboard');
    }
);

module.exports = router;
