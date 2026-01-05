import axios from "axios";
import { getKeys } from "../../lib/keys.js";
import { getUserIP } from "../../lib/ipDetect.js";
import { log } from "../../lib/logger.js";

export default async function handler(req, res) {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing q" });

  const ip = getUserIP(req);
  log("AI", "Ask request", ip);

  try {
    const keys = await getKeys();
    const GEMINI_KEY = keys.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      return res.status(500).json({ error: "GEMINI key missing" });
    }

    // 👇 পরিবর্তন: মডেলের নাম 'gemini-1.5-flash-latest' করা হয়েছে
    const r = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        contents: [{ parts: [{ text: q }] }]
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: GEMINI_KEY }
      }
    );

    const reply =
      r.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({
      success: true,
      ip,
      reply,
      source: "github-keys"
    });
  } catch (err) {
    // ডিবাগিংয়ের জন্য পুরো এররটা দেখুন
    console.error("API Error Detail:", err.response?.data); 
    
    res.status(500).json({ 
        error: "AI failed", 
        details: err.response?.data?.error?.message || err.message 
    });
  }
}
