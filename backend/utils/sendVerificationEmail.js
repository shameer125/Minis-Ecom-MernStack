const nodemailer = require('nodemailer');

function getTransport() {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: String(process.env.EMAIL_SECURE).toLowerCase() === 'true',
    auth: { user, pass },
  });
}

/**
 * Sign-up verification: numeric OTP plus optional magic link fallback.
 * If SMTP env is missing, logs OTP and URL for local development.
 */
async function sendSignupVerificationEmail({ to, otpCode, verifyUrl, otpExpiresMinutes }) {
  const transport = getTransport();
  const from =
    process.env.EMAIL_FROM || process.env.EMAIL_USER || 'MINIS <noreply@minis>';

  const mDisp =
    otpExpiresMinutes != null && Number.isFinite(Number(otpExpiresMinutes))
      ? Number(otpExpiresMinutes)
      : 60;
  const minWord = mDisp === 1 ? 'minute' : 'minutes';

  const subject = 'Verify your MINIS email';
  const text = [
    `Your MINIS email verification code is: ${otpCode}`,
    `(Expires in ${mDisp} ${minWord}.)`,
    '',
    'Or open this link in your browser:',
    verifyUrl,
    '',
    `If you did not create an account, ignore this message.`,
  ].join('\n');

  const html = `
    <p>Thanks for registering with MINIS.</p>
    <p style="font-size:1.25rem;font-weight:600;letter-spacing:0.2em;">${otpCode}</p>
    <p>Enter this code on the verification page (expires in <strong>${mDisp}</strong> ${minWord}).</p>
    <p>Or verify in one tap: <a href="${verifyUrl}">confirm your email address</a></p>
    <p>If you did not create an account, you can ignore this message.</p>
  `.trim();

  if (!transport) {
    console.warn(
      `[email] SMTP not configured — dev verification for ${to}: code=${otpCode} URL=${verifyUrl}`,
    );
    return;
  }

  await transport.sendMail({ from, to, subject, text, html });
}

module.exports = { sendSignupVerificationEmail };
