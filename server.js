const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// 📦 Middleware
app.use(cors());
app.use(express.json());

// 🌍 Serve static frontend (optional, if you’re hosting both frontend and backend together)
// Place your index.html, style.css, script.js inside a "public" folder
app.use(express.static(path.join(__dirname, "public")));

// 🔌 Connect to MongoDB Atlas using environment variable
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/userdb";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// 🧠 Schema & Model
const UserInfo = mongoose.model("UserInfo", {
  input1: String,
  input2: String,
  createdAt: { type: Date, default: Date.now },
});

// 📩 POST endpoint
app.post("/submit", async (req, res) => {
  const { input1, input2 } = req.body;

  try {
    const user = await UserInfo.create({ input1, input2 });
    console.log("✅ Saved:", user);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).send("Error saving data");
  }
});

// 🌐 Fallback route for frontend (optional if SPA)
// app.get("*", (req, res) => {
// res.sendFile(path.join(__dirname, "public", "index.html"));
//});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
