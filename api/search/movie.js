import axios from "axios";
import { getKeys } from "../../lib/keys.js";
import { getUserIP } from "../../lib/ipDetect.js";
import { log } from "../../lib/logger.js";

export default async function handler(req, res) {
  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ error: "Missing name (movie)" });
  }

  const ip = getUserIP(req);
  log("TMDB", `Search movie: ${name}`, ip);

  try {
    const keys = await getKeys();
    const TMDB_KEY = keys.TMDB_KEY;

    if (!TMDB_KEY) {
      return res.status(500).json({ error: "TMDB key missing" });
    }

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
      name
    )}`;

    const r = await axios.get(url);
    const movie = r.data?.results?.[0];

    if (!movie) {
      return res.json({
        success: false,
        message: "Movie not found"
      });
    }

    res.json({
      success: true,
      type: "movie",
      title: movie.title,
      release_date: movie.release_date,
      overview: movie.overview,
      rating: movie.vote_average,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      developer: {
        name: "MD Ariful Islam Asif",
        facebook: "https://www.facebook.com/theRebelAsif",
        organization: "The Rebel Squad",
        role: "CEO"
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "TMDB fetch failed" });
  }
}
