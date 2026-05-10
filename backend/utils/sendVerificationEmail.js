const nodemailer = require('nodemailer');
const { isSendEmailReady } = require('./sendEmail');

function smtpConfigured() {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  return Boolean(host && user && pass);
}

function resendApiConfigured() {
  return Boolean(String(process.env.RESEND_API_KEY || '').trim());
}

/** True when any outbound mail path exists (Gmail EMAIL_USER/PASS, custom SMTP, or Resend API). */
function emailConfigured() {
  return isSendEmailReady() || smtpConfigured() || resendApiConfigured();
}

function getTransport() {
  if (!smtpConfigured()) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: String(process.env.EMAIL_SECURE).toLowerCase() === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Resend SaaS HTTP API — set RESEND_API_KEY (+ optional RESEND_FROM).
 */
async function sendViaResend({ to, subject, text, html }) {
  const key = String(process.env.RESEND_API_KEY || '').trim();
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:
        process.env.RESEND_FROM?.trim()
        || 'MINIS App <onboarding@resend.dev>',
      to: [to],
      subject,
      text,
      html,
    }),
  });
  const rawBody = await res.text();
  if (res.ok) return;
  let detail = rawBody;
  try {
    const j = JSON.parse(rawBody);
    detail = j.message || rawBody;
  } catch (_) {
    /* keep rawBody */
  }
  throw new Error(detail || `Resend HTTP ${res.status}`);
}

/**
 * Sends sign-up OTP + magic link via Resend, SMTP (nodemailer), or logs only (development).
 */
async function sendSignupVerificationEmail({ to, otpCode, verifyUrl, otpExpiresMinutes }) {
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

  if (resendApiConfigured()) {
    await sendViaResend({ to, subject, text, html });
    return;
  }

  const transport = getTransport();
  if (transport) {
    const fromAddr =
      process.env.EMAIL_FROM || process.env.EMAIL_USER || 'MINIS <noreply@minis>';
    await transport.sendMail({
      from: fromAddr,
      to,
      subject,
      text,
      html,
    });
    return;
  }

  console.warn(
    `[email] No RESEND_API_KEY or SMTP (EMAIL_HOST/EMAIL_USER/EMAIL_PASS) — not sending. Dev copy for ${to}: code=${otpCode} | link=${verifyUrl}`,
  );

  const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
  if (isProd) {
    throw new Error(
      'Email is not configured. Set RESEND_API_KEY (easiest) or EMAIL_HOST, EMAIL_USER, EMAIL_PASS.',
    );
  }
}

module.exports = {
  sendSignupVerificationEmail,
  emailConfigured,
  smtpConfigured,
  resendApiConfigured,
};
