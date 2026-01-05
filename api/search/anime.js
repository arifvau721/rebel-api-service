import axios from "axios";

export default async function handler(req, res) {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({
      error: "Missing anime name. Use ?name="
    });
  }

  try {
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
      name
    )}&limit=1`;

    const r = await axios.get(url);
    const anime = r.data?.data?.[0];

    if (!anime) {
      return res.json({
        success: false,
        message: "Anime not found"
      });
    }

    res.json({
      success: true,
      type: "anime",
      title: anime.title,
      release_date: anime.aired.from?.split("T")[0],
      overview: anime.synopsis,
      rating: anime.score,
      poster: anime.images.jpg.image_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Anime fetch failed"
    });
  }
}
