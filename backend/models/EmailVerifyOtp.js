const mongoose = require('mongoose');

/** Pending email verification OTP (one row per signup email until verified). */
const emailVerifyOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true, select: false },
    expires: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('EmailVerifyOtp', emailVerifyOtpSchema);
