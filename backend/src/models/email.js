const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  mailbox: { type: String, required: true },
  uid: { type: Number, required: true },
  subject: String,
  from: [Object],
  to: [Object],
  date: Date,
  flags: [String],
  html: String,
  text: String,
  raw: String,
});

EmailSchema.index({ accountId: 1, mailbox: 1, uid: 1 }, { unique: true });
EmailSchema.index({ subject: 'text', text: 'text', from: 'text', to: 'text' });

module.exports = mongoose.model('Email', EmailSchema);
