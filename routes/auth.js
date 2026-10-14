const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "foodkatha-dev-secret-change-me";
const TOKEN_TTL = "30d"; // keep shopkeepers logged in on their phone

function signToken(user) {
  return jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

function cleanEmail(email) {
  return String(email || "").toLowerCase().trim();
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !name.trim() || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required." });
  }
  if (String(password).length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters." });
  }
  try {
    const existing = await User.findOne({ email: cleanEmail(email) });
    if (existing) {
      return res.status(400).json({ error: "This email is already registered. Please log in." });
    }
    const hashed = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: cleanEmail(email),
      password: hashed,
    });
    res.json({ token: signToken(user), name: user.name });
  } catch (err) {
    console.error("signup error:", err.message);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const user = await User.findOne({ email: cleanEmail(email) });
    if (!user) return res.status(401).json({ error: "Invalid email or password." });
    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password." });
    res.json({ token: signToken(user), name: user.name });
  } catch (err) {
    console.error("login error:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

module.exports = router;
