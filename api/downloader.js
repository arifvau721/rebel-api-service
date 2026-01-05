import axios from "axios";

export default async function handler(req, res) {
  const {
    yt,
    youtube,
    insta,
    instagram,
    tiktok,
    fb,
    facebook,
    pinterest,
    capcut
  } = req.query;

  let url, platform, endpoint;

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
  } else if (pinterest) {
    url = pinterest;
    platform = "pinterest";
    endpoint = "pintarest"; // nayan API spelling
  } else if (capcut) {
    url = capcut;
    platform = "capcut";
    endpoint = "capcut";
  } else {
    return res.status(400).json({
      success: false,
      error: "No valid parameter found",
      usage: {
        youtube: "/api/downloader?yt=URL",
        instagram: "/api/downloader?insta=URL",
        tiktok: "/api/downloader?tiktok=URL",
        facebook: "/api/downloader?fb=URL",
        pinterest: "/api/downloader?pinterest=URL",
        capcut: "/api/downloader?capcut=URL"
      }
    });
  }

  try {
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
