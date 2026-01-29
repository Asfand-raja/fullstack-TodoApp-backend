const { Resend } = require('resend');

// Initialize Resend lazily or handle missing key gracefully
let resend;
if (process.env.RESEND_API_KEY) {
    try {
        resend = new Resend(process.env.RESEND_API_KEY.trim());
        console.log('Resend Email Service: Initialized ✅');
    } catch (err) {
        console.error('Resend Initialization Error:', err.message);
    }
} else {
    console.log('--- EMAIL CONFIGURATION STATUS ---');
    console.log('Warning: RESEND_API_KEY is missing in .env');
    console.log('Help: Verification emails will be logged to console instead.');
    console.log('----------------------------------');
}

const sendVerificationEmail = async (email, code) => {
    if (!process.env.RESEND_API_KEY) {
        console.log('--- DEVELOPMENT MODE: RESEND NOT CONFIGURED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('-----------------------------------------------');
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Todo App <onboarding@resend.dev>', // Use this default sender for testing
            to: [email],
            subject: 'Your Registration Verification Code',
            text: `Welcome! Your verification code is: ${code}. Please enter this code to complete your signup.`,
        });

        if (error) {
            throw error;
        }

        console.log('Verification email sent via Resend to:', email);
    } catch (error) {
        console.error('Error sending email via Resend:', error.message);
        // Fallback to console instead of breaking the flow
        console.log('--- FALLBACK: EMAIL SENDING FAILED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('--------------------------------------');
    }
};

module.exports = { sendVerificationEmail };
