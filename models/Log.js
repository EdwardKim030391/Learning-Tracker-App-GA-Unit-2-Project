const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number, required: true },
  notes: { type: String }
});

module.exports = mongoose.model('Log', LogSchema);
