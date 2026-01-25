const UserModel = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('../utils/emailService');
const passport = require('passport');

// REGISTER
module.exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationCode: code
        });

        try {
            await sendVerificationEmail(email, code);
            res.status(201).json({ message: "Verification code sent to your email.", email: newUser.email });
        } catch (emailErr) {
            await UserModel.findByIdAndDelete(newUser._id);
            return res.status(500).json({ message: "Failed to send verification email. Please try again." });
        }
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: err.message });
    }
};

// VERIFY EMAIL
module.exports.verify = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.verificationCode === code) {
            user.isVerified = true;
            user.verificationCode = undefined;
            await user.save();
            res.status(200).json({ message: "Email verified successfully! You can now login." });
        } else {
            res.status(400).json({ message: "Invalid verification code" });
        }
    } catch (err) {
        console.error("Verification Error:", err);
        res.status(500).json({ message: err.message });
    }
};

// RESEND CODE
module.exports.resendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.isVerified) return res.status(400).json({ message: "Email is already verified" });

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = code;
        await user.save();

        try {
            await sendVerificationEmail(email, code);
            res.status(200).json({ message: "Verification code resent to your email." });
        } catch (emailErr) {
            return res.status(500).json({ message: "Failed to send verification email. Please try again." });
        }
    } catch (err) {
        console.error("Resend Error:", err);
        res.status(500).json({ message: err.message });
    }
};

// LOGIN (session-based)
module.exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return next(err);
            // user is now logged in, session cookie is set
            res.status(200).json({
                message: "Logged in successfully",
                user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
            });
        });
    })(req, res, next);
};

// LOGOUT
module.exports.logout = (req, res) => {
    req.logout(() => {
        res.status(200).json({ message: "Logged out successfully" });
    });
};
