import axios from "axios";

// 🛠️ কনফিগারেশন
const DEVELOPER_NAME = "Md Aiful Islam Asif";
const FACEBOOK_LINK = "https://facebook.com/your_id";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing url", 
      developer: DEVELOPER_NAME 
    });
  }

  try {
    // ১. বিকল্প একটি শক্তিশালী পাবলিক API ব্যবহার করা হচ্ছে
    // এটি TeraBox এর ব্লক বাইপাস করতে সক্ষম
    const apiUrl = `https://teraboxvideodownloader.nepcoderdevs.workers.dev/?url=${url}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    // ২. রেসপন্স ভ্যালিডেশন
    if (!data || !data.response || data.response.length === 0) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch video info. The link might be expired or private.",
        developer: DEVELOPER_NAME
      });
    }

    const videoInfo = data.response[0];

    // ৩. রেজাল্ট সাজানো (আপনার ফরম্যাটে)
    res.json({
      success: true,
      platform: "terabox",
      developer: DEVELOPER_NAME,
      facebook: FACEBOOK_LINK,
      original_url: url,
      // API ভেদে নামগুলো ভিন্ন হতে পারে, তাই সেফটি চেক রাখা হলো
      title: videoInfo.title || "TeraBox Video",
      size: videoInfo.size || "Unknown", 
      thumbnail: videoInfo.thumbnail || null,
      // এখান থেকে আসা লিঙ্কগুলো সাধারণত HD এবং Fast Download হয়
      download: videoInfo.resolutions["Fast Download"] || videoInfo.resolutions["HD Video"] || videoInfo.downloadUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "API Proxy Error",
      developer: DEVELOPER_NAME,
      details: "External API is busy or blocked by Vercel IP. Try running locally."
    });
  }
}
