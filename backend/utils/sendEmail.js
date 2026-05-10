const nodemailer = require('nodemailer');

/** App sender display name shown in inbox "From" alongside EMAIL_USER */
const APP_SENDER_NAME = process.env.APP_NAME || 'MINIS App';

/** True when Gmail Nodemailer auth vars are present (minimal setup for signup mail). */
function isSendEmailReady() {
  const u = String(process.env.EMAIL_USER || '').trim();
  const p = String(process.env.EMAIL_PASS || '').trim();
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
        pass: process.env.EMAIL_PASS,
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
