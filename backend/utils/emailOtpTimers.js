/** Resend cooldown for email OTP (milliseconds). Override with EMAIL_OTP_RESEND_SECONDS. */
function emailOtpCooldownMs() {
  const n = Number(process.env.EMAIL_OTP_RESEND_SECONDS);
  return Number.isFinite(n) && n >= 30 ? n * 1000 : 55_000;
}

/** OTP validity (milliseconds). Override with EMAIL_OTP_EXPIRES_MINUTES. Default 60 min. */
function emailOtpExpiryMs() {
  const mins = Number(process.env.EMAIL_OTP_EXPIRES_MINUTES);
  if (Number.isFinite(mins) && mins >= 5 && mins <= 7 * 24 * 60) return mins * 60 * 1000;
  return 60 * 60 * 1000;
}

module.exports = {
  emailOtpCooldownMs,
  emailOtpExpiryMs,
};
