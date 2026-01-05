import axios from "axios";

export default async function handler(req, res) {
  const { yt, youtube, insta, instagram, tiktok, fb, facebook } = req.query;

  let url = null;
  let platform = null;
  let endpoint = null;

  // 🔍 Detect platform
  if (yt || youtube) {
    url = yt || youtube;
    platform = "youtube";
    endpoint = "ytdown";
  } else if (insta || instagram) {
    url = insta || instagram;
    platform = "instagram";
    endpoint = "instagram";
  } else if (tiktok) {
    url = tiktok;
    platform = "tiktok";
    endpoint = "tikdown";
  } else if (fb || facebook) {
    url = fb || facebook;
    platform = "facebook";
    endpoint = "fbdown2";
  } else {
    return res.status(400).json({
      success: false,
      error: "No valid parameter found",
      usage: {
        youtube: "/api/downloader?yt=URL",
        instagram: "/api/downloader?insta=URL",
        tiktok: "/api/downloader?tiktok=URL",
        facebook: "/api/downloader?fb=URL"
      }
    });
  }

  // 🚫 Facebook temporarily disabled (API key issue)
  if (platform === "facebook") {
    return res.json({
      success: false,
      platform,
      error: "Facebook download temporarily unavailable",
      reason: "External API now requires private key",
      suggestion: "Use browser-based downloader"
    });
  }

  try {
    // 🌐 External API call
    const { data } = await axios.get(
      `https://nayan-video-downloader.vercel.app/${endpoint}`,
      { params: { url } }
    );

    if (!data || data.error) {
      throw new Error(data?.error || "External API error");
    }

    const result = data.data || data.result || data;

    res.json({
      success: true,
      platform,
      original_url: url,
      title: result.title || null,
      thumbnail:
        result.thumbnail ||
        "https://i.postimg.cc/FHdTnVgj/Not-Available.jpg",
      result,
      developer: {
        name: "Md Ariful Islam Asif",
        fb: "https://www.facebook.com/ARIF.THE.REBEL.233"
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      platform,
      error: "Downloader failed",
      details: err.message
    });
  }
}
