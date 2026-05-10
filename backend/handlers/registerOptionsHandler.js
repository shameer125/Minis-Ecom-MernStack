const { emailConfigured } = require('../utils/sendVerificationEmail');
const { smsSignupConfigured } = require('../utils/registerSms');
const { emailOtpCooldownMs } = require('../utils/emailOtpTimers');

function smsResendCooldownMs() {
  const n = Number(process.env.SMS_RESEND_SECONDS);
  return Number.isFinite(n) && n >= 30 ? n * 1000 : 55_000;
}

/** Used from server.js root routes (before nested routers) — must not depend on auth router exports. */
function registerOptionsHandler(req, res) {
  res.json({
    phoneVerificationRequired: smsSignupConfigured(),
    smsResendCooldownSeconds: Math.round(smsResendCooldownMs() / 1000),
    emailOtpResendCooldownSeconds: Math.round(emailOtpCooldownMs() / 1000),
    emailDeliveryConfigured: emailConfigured(),
  });
}

module.exports = { registerOptionsHandler };
