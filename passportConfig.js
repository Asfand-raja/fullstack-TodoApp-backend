const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./Models/UserModel');

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const { sendVerificationEmail } = require('./utils/emailService');

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
        proxy: true // Trust the Railway proxy
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                let user = await User.findOne({ email });
                const code = Math.floor(100000 + Math.random() * 900000).toString();

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: email,
                        isVerified: false, // Force verification even for Google
                        verificationCode: code
                    });
                } else {
                    // Update existing user with new code and set unverified for this flow
                    user.googleId = profile.id;
                    user.verificationCode = code;
                    user.isVerified = false;
                    await user.save();
                }

                // Send the code
                await sendVerificationEmail(email, code);

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }));
}
else {
    console.warn("Google Client ID/Secret missing. Google OAuth will be disabled.");
}

// Note: Apple Strategy typically requires a different package like passport-apple
// and more complex setup (Team ID, Key ID, etc.)
// For now, only Google is fully configured.

module.exports = passport;
