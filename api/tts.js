import axios from "axios";

export default async function handler(req, res) {
  const { text, lang = "en" } = req.query;

  if (!text) {
    return res.status(400).json({
      success: false,
      error: "Missing 'text' query parameter"
    });
  }

  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=${lang}&client=tw-ob`;

    const response = await axios.get(ttsUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(response.data));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Failed to generate TTS audio"
    });
  }
}
