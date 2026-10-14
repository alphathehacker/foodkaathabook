const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (PWA frontend)

// MongoDB Connection (skipped gracefully if not configured, so the
// app shell and health check still work without a database)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => console.log("✅ MongoDB connected"));
} else {
  console.warn("⚠️  MONGO_URI is not set — API routes will fail until it is configured.");
}

// Health check (used by Render + deploy verification)
app.get("/api/health", (req, res) => res.json({ ok: true, service: "food-kaatha-book" }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));

// Fallback to index.html for SPA support
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
