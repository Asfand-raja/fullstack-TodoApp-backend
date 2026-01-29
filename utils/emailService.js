const https = require('https');

const sendVerificationEmail = async (email, code) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_USER || 'r.asfand3249@gmail.com';

    if (!apiKey) {
        console.log('--- DEVELOPMENT MODE: BREVO NOT CONFIGURED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('-----------------------------------------------');
        console.log('💡 TIP: Add BREVO_API_KEY to your Railway variables to enable real emails.');
        return;
    }

    const data = JSON.stringify({
        sender: { name: 'Todo App', email: senderEmail },
        to: [{ email: email }],
        subject: 'Your Registration Verification Code',
        htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #4b3621; text-align: center;">Welcome to Todo App!</h2>
                <p style="text-align: center;">Your verification code is:</p>
                <div style="background: #f4f4f4; padding: 15px; font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #4b3621; border-radius: 5px; margin: 20px 0;">
                    ${code}
                </div>
                <p style="text-align: center;">Please enter this code in the app to complete your signup.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 0.8rem; color: #777; text-align: center;">If you didn't request this, please ignore this email.</p>
            </div>
        `
    });

    const options = {
        hostname: 'api.brevo.com',
        port: 443,
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
            'api-key': apiKey,
            'content-type': 'application/json',
            'accept': 'application/json',
            'content-length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log('✅ Verification email sent via Brevo API to:', email);
            } else {
                console.error('❌ Brevo API Error:', res.statusCode, responseBody);
                console.log('--- FALLBACK: EMAIL SENDING FAILED ---');
                console.log(`Verification code for ${email}: ${code}`);
                console.log('--------------------------------------');
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request Error:', error.message);
        console.log('--- FALLBACK: EMAIL SENDING FAILED ---');
        console.log(`Verification code for ${email}: ${code}`);
        console.log('--------------------------------------');
    });

    req.write(data);
    req.end();
};

module.exports = { sendVerificationEmail };
