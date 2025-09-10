const mongoose = require('mongoose');

const ImapAccountSchema = new mongoose.Schema({
  accountId: { type: String, required: true, unique: true },
  host: { type: String, required: true },
  port: { type: Number, required: true },
  secure: { type: Boolean, default: true },
  user: { type: String, required: true },
  pass: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ImapAccount', ImapAccountSchema);
