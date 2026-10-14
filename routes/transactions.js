const express = require("express");
const jwt = require("jsonwebtoken");
const Transaction = require("../models/Transaction");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "foodkatha-dev-secret-change-me";

// Every transaction endpoint requires a logged-in shopkeeper,
// and every transaction is scoped to that shopkeeper's userId.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not logged in." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

router.use(requireAuth);

// GET all of MY transactions (newest first)
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// POST a new transaction
router.post("/", async (req, res) => {
  const { customer, amount, type, items } = req.body;
  if (!customer || !String(customer).trim()) {
    return res.status(400).json({ error: "Customer name is required." });
  }
  const txnType = type === "paid" ? "paid" : "katha";
  try {
    const newTransaction = await Transaction.create({
      userId: req.user.id,
      customer: String(customer).trim(),
      amount: Number(amount) || 0,
      type: txnType,
      items: Array.isArray(items) ? items : [],
    });
    res.json(newTransaction);
  } catch (err) {
    res.status(400).json({ error: "Error adding transaction." });
  }
});

// PUT update one of MY transactions
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Transaction not found." });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Error updating transaction." });
  }
});

// DELETE one of MY transactions
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ error: "Transaction not found." });
    res.json({ message: "Transaction deleted." });
  } catch (err) {
    res.status(400).json({ error: "Error deleting transaction." });
  }
});

module.exports = router;
