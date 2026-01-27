const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,    // 5 seconds
    debug: true,
    logger: true
});

// Debug logs (Safe logging)
console.log('Email Config initialized for:', process.env.EMAIL_USER || 'Not Set');

// Verify connection configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.log('--- EMAIL CONFIGURATION STATUS ---');
        console.log('Error: Could not connect to any mail server.');
        console.log('Reason:', error.message);
        console.log('Help: Check your internet connection or firewall settings.');
        console.log('Help: If using Gmail, ensure "App Passwords" are correct.');
        console.log('----------------------------------');
    } else {
        console.log('Email server is ready to send messages! ✅');
    }
});

const sendVerificationEmail = async (email, code) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('--- DEVELOPMENT MODE: EMAIL NOT CONFIGURED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('---------------------------------------------');
        return;
    }

    const mailOptions = {
        from: `"Todo App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Registration Verification Code',
        text: `Welcome! Your verification code is: ${code}. Please enter this code to complete your signup.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Error sending email:', error.message);
        // Fallback to console instead of breaking the flow
        console.log('--- FALLBACK: EMAIL SENDING FAILED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('--------------------------------------');
    }
};

module.exports = { sendVerificationEmail };
