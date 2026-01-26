const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
    logger: true
});

// Debug logs
console.log('Email Config:', {
    service: 'gmail',
    user: process.env.EMAIL_USER ? 'Set' : 'Missing',
    pass: process.env.EMAIL_PASS ? 'Set' : 'Missing'
});

// Email service initialized
console.log('Email Service: Initialized');

const sendVerificationEmail = async (email, code) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('--- DEVELOPMENT MODE: EMAIL NOT CONFIGURED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('---------------------------------------------');
        return; // Proceed without throwing error
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Registration Verification Code',
        text: `Welcome! Your verification code is: ${code}. Please enter this code to complete your signup.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
        // Fallback to console instead of breaking the flow
        console.log('--- FALLBACK: EMAIL SENDING FAILED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('--------------------------------------');
    }
};

module.exports = { sendVerificationEmail };
