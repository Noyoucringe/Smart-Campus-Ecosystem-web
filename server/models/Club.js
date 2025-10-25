const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  color: String,
  nextMeeting: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  membersCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Club || mongoose.model('Club', ClubSchema);
