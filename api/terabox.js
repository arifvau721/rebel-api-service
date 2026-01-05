import axios from "axios";

// 🛠️ কনফিগারেশন
const DEVELOPER_NAME = "Md Aiful Islam Asif";
const FACEBOOK_LINK = "https://facebook.com/your_id";

export default async function handler(req, res) {
  const { url } = req.query;

  // ১. ইনপুট চেক
  if (!url) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing url", 
      developer: DEVELOPER_NAME 
    });
  }

  try {
    // ২. SaveTube API তে রিকোয়েস্ট পাঠানো
    // এটি POST মেথড ব্যবহার করে এবং Vercel এ এখনো সচল আছে
    const apiUrl = "https://ytshorts.savetube.me/api/v1/terabox-downloader";
    
    const response = await axios.post(apiUrl, {
      url: url
    }, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Content-Type": "application/json"
      }
    });

    const data = response.data;

    // ৩. রেসপন্স চেক করা
    // SaveTube এর স্ট্যাটাস সাধারণত true/false বা কোড দিয়ে চেক করতে হয়
    if (!data || !data.response) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch video info via SaveTube.",
        developer: DEVELOPER_NAME,
        details: "Link might be expired or the API is busy."
      });
    }

    const info = data.response[0]; // তথ্যের মূল অংশ

    // ৪. রেজাল্ট সাজানো (আপনার ফরম্যাটে)
    // SaveTube ভিন্ন ফরম্যাটে ডাটা দেয়, তাই আমরা সেটা ম্যাপ করে নিচ্ছি
    
    // ডাউনলোড লিঙ্ক বের করা (সাধারণত একাধিক রেজোলিউশন থাকে, আমরা প্রথমটি নিচ্ছি)
    let downloadLink = null;
    let size = "Unknown";
    
    if (info.resolutions && info.resolutions["Fast Download"]) {
        downloadLink = info.resolutions["Fast Download"];
    } else if (info.resolutions && info.resolutions["HD Video"]) {
        downloadLink = info.resolutions["HD Video"];
    } else {
        downloadLink = info.downloadUrl; // ফলব্যাক
    }

    // ৫. সাকসেস রেসপন্স
    res.json({
      success: true,
      platform: "terabox",
      developer: DEVELOPER_NAME,
      facebook: FACEBOOK_LINK,
      original_url: url,
      title: info.title || "TeraBox Video",
      size: size, // SaveTube সবসময় সাইজ দেয় না
      thumbnail: info.thumbnail || null,
      download: downloadLink
    });

  } catch (err) {
    console.error("SaveTube API Error:", err.message);
    
    res.status(500).json({
      success: false,
      error: "API Request Failed",
      developer: DEVELOPER_NAME,
      details: err.response?.data || err.message
    });
  }
}
