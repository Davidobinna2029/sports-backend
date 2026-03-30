import express from "express";
import cors from "cors";

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   MOCK DATABASE (TEMP)
   → Replace with real DB later
========================= */
let articles = [
  {
    id: 1,
    title: "Arsenal secure dramatic late win",
    summary: "Late goal seals all three points in a tense clash.",
    image: "https://via.placeholder.com/600x400",
    views: 1500,
    date: new Date(),
    trending: true,
    breaking: true
  },
  {
    id: 2,
    title: "Transfer talks intensify ahead of deadline",
    summary: "Clubs push to complete last-minute deals.",
    image: "https://via.placeholder.com/600x400",
    views: 900,
    date: new Date(Date.now() - 2 * 3600000),
    trending: true,
    breaking: false
  },
  {
    id: 3,
    title: "Injury update before weekend fixture",
    summary: "Key player faces late fitness test.",
    image: "https://via.placeholder.com/600x400",
    views: 600,
    date: new Date(Date.now() - 5 * 3600000),
    trending: false,
    breaking: false
  },
  {
    id: 4,
    title: "Manager reacts to big victory",
    summary: "Post-match reaction reveals key tactical insight.",
    image: "https://via.placeholder.com/600x400",
    views: 400,
    date: new Date(Date.now() - 8 * 3600000),
    trending: false,
    breaking: false
  }
];

/* =========================
   🧠 RANKING ENGINE
========================= */
function rankArticles(data) {
  return data
    .map(article => {
      const ageHours = (Date.now() - new Date(article.date)) / 36e5;

      const recencyScore = Math.max(0, 100 - ageHours * 2);
      const engagementScore = article.views * 0.2;
      const trendingBoost = article.trending ? 40 : 0;
      const breakingBoost = article.breaking ? 60 : 0;

      return {
        ...article,
        score: recencyScore + engagementScore + trendingBoost + breakingBoost
      };
    })
    .sort((a, b) => b.score - a.score);
}

/* =========================
   📰 FEED API (INFINITE SCROLL READY)
========================= */
app.get("/api/feed", (req, res) => {
  const page = parseInt(req.query.page || 1);
  const limit = 6;

  const ranked = rankArticles(articles);

  const start = (page - 1) * limit;
  const paginated = ranked.slice(start, start + limit);

  res.json({
    page,
    hasMore: start + limit < ranked.length,
    data: paginated
  });
});

/* =========================
   🔴 LIVE MATCHES (MOCK FOR NOW)
========================= */
app.get("/api/live", (req, res) => {
  const liveMatches = [
    {
      id: 1,
      home: "Arsenal",
      away: "Chelsea",
      score: "2 - 1",
      minute: "78'",
      status: "LIVE"
    },
    {
      id: 2,
      home: "Barcelona",
      away: "Real Madrid",
      score: "1 - 1",
      minute: "65'",
      status: "LIVE"
    }
  ];

  res.json(liveMatches);
});

/* =========================
   🔍 SINGLE ARTICLE (FUTURE USE)
========================= */
app.get("/api/article/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const article = articles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.json(article);
});

/* =========================
   🧪 HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Sports Backend Running (ESPN System Ready)");
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
