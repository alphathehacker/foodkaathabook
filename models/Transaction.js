const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  customer: { type: String, required: true },
  items: [{ name: String, price: Number }],
  amount: { type: Number, default: 0 },
  type: { type: String, enum: ['paid', 'katha'], default: 'katha' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
