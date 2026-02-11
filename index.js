const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

// 🔍 Search DuckDuckGo
async function searchWeb(query) {
    const url = "https://duckduckgo.com/html/?q=" + encodeURIComponent(query);

    const response = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(response.data);
    let links = [];

    $(".result__a").each((i, el) => {
        if (i < 3) {
            links.push($(el).attr("href"));
        }
    });

    return links;
}

// 🌐 Scrape basic paragraph text
async function scrapePage(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let text = "";
        $("p").each((i, el) => {
            if (i < 5) {
                text += $(el).text() + " ";
            }
        });

        return text;
    } catch {
        return "";
    }
}

// 🤖 Main AI route
app.get("/agent", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.json({ error: "No query provided" });
    }

    try {
        const links = await searchWeb(query);
        let combined = "";

        for (let link of links) {
            combined += await scrapePage(link);
        }

        res.json({
            answer: combined.substring(0, 1200),
            sources: links
        });

    } catch (err) {
        res.json({ error: "Search failed" });
    }
});

app.listen(3000, () => {
    console.log("GYAN backend running on port 3000");
});
