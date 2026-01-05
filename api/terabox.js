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
    // ১. শর্ট লিঙ্ক ID বের করা
    let shortKey = "";
    if (url.includes("/s/")) {
      shortKey = url.split("/s/")[1];
    } else {
      shortKey = url.split("/").pop();
    }

    // ২. আপনার দেওয়া Worker URL
    const apiUrl = `https://terabox.hnn.workers.dev/api/get-info-new?shorturl=${shortKey}&pwd=`;

    // ৩. ⚠️ ফেইক হেডার্স (Vercel কে লুকানোর জন্য)
    // 403 ফিক্স করার জন্য Referer এবং Origin খুব গুরুত্বপূর্ণ
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://terabox.hnn.workers.dev/", // মনে হবে রিকোয়েস্ট তাদের সাইট থেকেই গেছে
        "Origin": "https://terabox.hnn.workers.dev",
        "Accept": "application/json, text/plain, */*",
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    const data = response.data;

    // ৪. ডেটা চেক
    if (!data.list || data.list.length === 0) {
      // লিঙ্ক এক্সপায়ারড বা ভুল হলে
      return res.status(404).json({
        success: false,
        error: "File not found or Link Expired",
        developer: DEVELOPER_NAME
      });
    }

    const file = data.list[0];

    // ৫. সাকসেস রেসপন্স
    res.json({
      success: true,
      platform: "terabox",
      developer: DEVELOPER_NAME,
      facebook: FACEBOOK_LINK,
      original_url: url,
      title: file.server_filename, 
      size: file.size,             
      thumbnail: file.thumbs ? file.thumbs.url3 : null, 
      download: file.dlink         
    });

  } catch (err) {
    // ডিবাগিং: কনসোলে আসল এরর প্রিন্ট হবে
    console.error("Worker Error Details:", err.response ? err.response.data : err.message);
    
    res.status(500).json({
      success: false,
      error: "Worker Blocked Vercel IP (403)",
      developer: DEVELOPER_NAME,
      details: "The worker detected Vercel IP and rejected it. Try running locally."
    });
  }
}
