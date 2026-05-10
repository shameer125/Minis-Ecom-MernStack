const nodemailer = require('nodemailer');

/** App sender display name shown in inbox "From" alongside EMAIL_USER */
const APP_SENDER_NAME = process.env.APP_NAME || 'MINIS App';

/** Gmail App Passwords are often pasted with spaces; SMTP expects the contiguous 16 chars. */
function gmailPassNormalized() {
  return String(process.env.EMAIL_PASS || '').replace(/\s+/g, '');
}

/** True when Gmail Nodemailer auth vars are present (minimal setup for signup mail). */
function isSendEmailReady() {
  const u = String(process.env.EMAIL_USER || '').trim();
  const p = gmailPassNormalized();
  return Boolean(u && p);
}

/**
 * Sends a single HTML mail via Gmail (service transport).
 * @param {{ to: string, subject: string, html: string }} opts
 */
async function sendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: gmailPassNormalized(),
      },
    });

    await transporter.sendMail({
      from: `${APP_SENDER_NAME} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('[sendEmail]', err.message || err);
    throw err;
  }
}

module.exports = {
  sendEmail,
  isSendEmailReady,
};
