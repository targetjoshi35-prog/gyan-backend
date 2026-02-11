const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GYAN Server is Running ✅");
});

app.post("/ask", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "No message received." });
  }

  try {
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      message
    )}&format=json`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.AbstractText) {
      res.json({ reply: data.AbstractText });
    } else {
      res.json({
        reply:
          "I searched online but could not find a clear answer.",
      });
    }
  } catch (error) {
    res.json({
      reply: "Error fetching online data.",
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
