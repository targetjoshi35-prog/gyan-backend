const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ROOT ROUTE (THIS FIXES YOUR ERROR)
app.get("/", (req, res) => {
  res.send("GYAN Backend is Live 🚀");
});

// ✅ ASK ROUTE
app.post("/ask", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "No message received." });
  }

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      message
    )}&format=json`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.AbstractText) {
      res.json({ reply: data.AbstractText });
    } else {
      res.json({
        reply: "I searched online but no clear answer found.",
      });
    }
  } catch (error) {
    res.json({
      reply: "Error while fetching online data.",
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
