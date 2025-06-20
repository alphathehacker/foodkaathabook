const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customer: String,
  items: [
    {
      name: String,
      price: Number,
    }
  ],
  amount: Number,
  type: { type: String, enum: ['paid', 'katha'] },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
