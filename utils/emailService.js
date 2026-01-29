const nodemailer = require('nodemailer');

// 📧 Create a transporter using Gmail SMTP
// Note: We use Port 465 (SSL) which is generally more reliable in cloud environments than 587
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    },
    tls: {
        rejectUnauthorized: false // Helps avoid some certificate issues in cloud envs
    }
});

// Verification check on startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('--- EMAIL CONFIGURATION STATUS ---');
    console.log('Warning: EMAIL_USER or EMAIL_PASS is missing in .env');
    console.log('Help: Verification emails will be logged to console instead.');
    console.log('----------------------------------');
} else {
    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ Gmail SMTP Verification Failure:', error.message);
        } else {
            console.log('✅ Gmail SMTP Ready: Can send to anyone for free!');
        }
    });
}

const sendVerificationEmail = async (email, code) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('--- DEVELOPMENT MODE: EMAIL NOT CONFIGURED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('-----------------------------------------------');
        return;
    }

    const mailOptions = {
        from: `"Todo App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Registration Verification Code',
        text: `Welcome! Your verification code is: ${code}. Please enter this code to complete your signup.`,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4b3621;">Welcome to Todo App!</h2>
                <p>Your verification code is:</p>
                <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #4b3621; border-radius: 5px;">
                    ${code}
                </div>
                <p>Please enter this code in the app to complete your signup.</p>
                <p style="font-size: 0.8rem; color: #777;">If you didn't request this, please ignore this email.</p>
               </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent via Gmail to:', email);
    } catch (error) {
        console.error('Error sending email via Gmail:', error.message);

        // Detailed help for cloud timeout issues
        if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
            console.log('💡 TIP: Cloud providers (Railway/Render) sometimes block standard email ports.');
            console.log('💡 If this persists, the app will continue to use the console fallback below.');
        }

        // Fallback to console instead of breaking the flow
        console.log('--- FALLBACK: EMAIL SENDING FAILED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('--------------------------------------');
    }
};

module.exports = { sendVerificationEmail };
