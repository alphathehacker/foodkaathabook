const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customer: String,
  items: [{ name: String, price: Number }],
  amount: Number,
  type: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
