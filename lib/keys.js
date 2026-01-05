import axios from "axios";

const KEY_URL =
  "https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/Rebel/main/key.json";

let cache = null;
let lastFetch = 0;
const CACHE_TIME = 1000 * 60 * 5; // 5 minutes

export async function getKeys() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TIME) {
    return cache;
  }

  try {
    const res = await axios.get(KEY_URL, { timeout: 5000 });
    cache = res.data;
    lastFetch = now;
    return cache;
  } catch (err) {
    console.error("KEY LOAD FAILED");
    throw new Error("KEY_LOAD_FAILED");
  }
}
