import axios from "axios";

export default async function handler(req, res) {
  const { emoji1, emoji2 } = req.query;

  if (!emoji1 || !emoji2) {
    return res.status(400).json({
      success: false,
      error: "Provide emoji1 and emoji2"
    });
  }

  try {
    const apiUrl = `http://65.109.80.126:20392/nayan/emojimix?emoji1=${encodeURIComponent(
      emoji1
    )}&emoji2=${encodeURIComponent(emoji2)}`;

    const response = await axios.get(apiUrl, {
      responseType: "arraybuffer"
    });

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(response.data));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Failed to mix emojis"
    });
  }
}
