const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // Optional: For environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Email validation helper
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// ✅ Use an environment variable for the webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://ravulakolluganesh06.app.n8n.cloud/webhook-test/GenerationForm";

app.post("/api/Generationform", async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const response = await axios.post(N8N_WEBHOOK_URL, {
      name,
      email,
      company,
      message,
    });

    console.log("✅ Forwarded to n8n:", response.data);
    res.status(200).json({ message: "Lead submitted and forwarded to automation." });
  } catch (error) {
    console.error("❌ Error forwarding to n8n:", error.message);
    res.status(500).json({ error: "Failed to forward data to automation service." });
  }
});

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
