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
 * Sends the verification email. If SMTP env is missing, logs the URL (local dev fallback).
 */
async function sendVerificationEmail({ to, verifyUrl }) {
  const transport = getTransport();
  const from =
    process.env.EMAIL_FROM || process.env.EMAIL_USER || 'MINIS <noreply@minis>';

  const subject = 'Verify your MINIS email';
  const text = `Verify your MINIS account by opening this link:\n${verifyUrl}`;
  const html = `
    <p>Thanks for registering with MINIS.</p>
    <p><a href="${verifyUrl}">Click here to verify your email address</a></p>
    <p>If you did not create an account, you can ignore this message.</p>
  `.trim();

  if (!transport) {
    console.warn('[email] SMTP not configured; verification link (dev):', verifyUrl);
    return;
  }

  await transport.sendMail({ from, to, subject, text, html });
}

module.exports = { sendVerificationEmail };
