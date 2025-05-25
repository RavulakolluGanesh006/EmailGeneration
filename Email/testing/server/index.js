const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Email validation helper
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// 📌 Replace this with your actual n8n webhook URL
const N8N_WEBHOOK_URL = "https://ravulakolluganesh06.app.n8n.cloud/webhook-test/GenerationForm";

app.post("/api/Generationform", async (req, res) => {
  const { name, email, company, message } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    // ✅ Forward the data to n8n via webhook
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

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
