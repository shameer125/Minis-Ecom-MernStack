const mongoose = require('mongoose');

/** One pending SMS verification per phone for registration. */
const smsRegisterOtpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true, trim: true },
    otpHash: { type: String, required: true, select: false },
    expires: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SmsRegisterOtp', smsRegisterOtpSchema);
