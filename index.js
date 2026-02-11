const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GYAN Backend is Live 🚀");
});

app.post("/ask", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Please ask something." });
  }

  try {
    // 1️⃣ Try Wikipedia First
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(message)}`;
    
    try {
      const wikiResponse = await axios.get(wikiUrl);
      if (wikiResponse.data.extract) {
        return res.json({ reply: wikiResponse.data.extract });
      }
    } catch (wikiError) {
      // If Wikipedia fails, continue to DuckDuckGo
    }

    // 2️⃣ Fallback to DuckDuckGo
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(message)}&format=json`;
    const ddgResponse = await axios.get(ddgUrl);
    const data = ddgResponse.data;

    if (data.AbstractText) {
      return res.json({ reply: data.AbstractText });
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      return res.json({ reply: data.RelatedTopics[0].Text });
    }

    return res.json({
      reply: "I searched online but could not find clear information."
    });

  } catch (error) {
    return res.json({
      reply: "Server error while searching."
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
