const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true } // bcrypt hash, never plain text
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
