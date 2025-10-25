const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, index: true },
  email: { type: String, required: true, unique: true },
  name: String,
  picture: String,
  role: { type: String, enum: ['student','faculty','admin'], default: 'student' },
  // password-based auth
  passwordHash: String,
  isVerified: { type: Boolean, default: false },
  // OTP for email verification (signup)
  otpCode: String,
  otpExpires: Date,
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
