import { getKeys } from "../../lib/keys.js";

export default async function handler(req, res) {
  try {
    const keys = await getKeys();

    res.json({
      status: true,
      keysLoaded: Object.keys(keys || {}).length,
      message: "Rebel AI API running"
    });
  } catch {
    res.status(500).json({
      status: false,
      message: "Key system failed"
    });
  }
}
