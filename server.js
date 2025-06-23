const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI);
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// Schema & Model
const UserInfo = mongoose.model("UserInfo", {
  input1: String,
  input2: String,
  createdAt: { type: Date, default: Date.now },
});

// POST route
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
