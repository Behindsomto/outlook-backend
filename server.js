const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // Allow frontend from different location
app.use(express.json());

// 🔌 Connect to MongoDB (local)
mongoose.connect("mongodb://127.0.0.1:27017/userdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// 🧠 Schema & Model (called userinfos)
const UserInfo = mongoose.model("UserInfo", {
  input1: String,
  input2: String,
  createdAt: { type: Date, default: Date.now },
});

// 📩 Endpoint to receive data
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

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
