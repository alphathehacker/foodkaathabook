const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// POST a new transaction
router.post("/", async (req, res) => {
  const { customer, amount, type, items } = req.body;
  try {
    const newTransaction = new Transaction({ customer, amount, type, items });
    await newTransaction.save();
    res.json(newTransaction);
  } catch (err) {
    res.status(400).json({ error: "Error adding transaction." });
  }
});

// PUT update a transaction
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Error updating transaction." });
  }
});

// DELETE a transaction
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted." });
  } catch (err) {
    res.status(400).json({ error: "Error deleting transaction." });
  }
});

module.exports = router;
