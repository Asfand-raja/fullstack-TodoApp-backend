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

// Verify connection configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.log('--- EMAIL CONFIGURATION STATUS ---');
        console.log('Error: Could not connect to the mail server.');
        console.log('Reason:', error.message);
        console.log('Help: Ensure you have added EMAIL_USER and EMAIL_PASS to your .env file.');
        console.log('Help: If using Gmail, you MUST use an "App Password," not your regular password.');
        console.log('----------------------------------');
    } else {
        console.log('Server is ready to send emails to your users! ✅');
    }
});

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
