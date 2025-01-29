const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['English', 'Math', 'Science', 'Computer'],
    required: true
  },
  duration: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Log', LogSchema);
