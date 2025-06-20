const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number
    }
  ],
  amount: { type: Number, required: true },
  type: { type: String, enum: ['paid', 'katha'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
