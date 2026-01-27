const { Resend } = require('resend');

// Initialize Resend with API Key from environment (trimmed for safety)
const resend = new Resend((process.env.RESEND_API_KEY || '').trim());

// Verification test on startup (via a sample log)
if (!process.env.RESEND_API_KEY) {
    console.log('--- EMAIL CONFIGURATION STATUS ---');
    console.log('Error: RESEND_API_KEY is missing in .env');
    console.log('Help: Get a key from resend.com and add it to your .env file.');
    console.log('----------------------------------');
} else {
    console.log('Resend Email Service: Initialized ✅');
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
