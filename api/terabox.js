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
    // ১. শর্ট লিঙ্ক আইডি বের করা
    let shortKey = "";
    if (url.includes("/s/")) {
      shortKey = url.split("/s/")[1];
    } else {
      shortKey = url.split("/").pop();
    }

    // ২. রিলে সার্ভার ব্যবহার করা (কারণ আপনার IP ব্লকড)
    // আমরা একটি পাবলিক ক্লাউডফ্লেয়ার ওয়ার্কার ব্যবহার করছি যা ব্লক বাইপাস করতে পারে
    const relayApiUrl = `https://terabox-dl.qtcloud.workers.dev/api/get-info?shorturl=${shortKey}&pwd=`;

    const response = await axios.get(relayApiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const data = response.data;

    // ৩. রিলে সার্ভারের এরর চেক করা
    if (!data.success && !data.list) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch data via Relay. Link might be dead.",
        developer: DEVELOPER_NAME
      });
    }

    // ৪. ডেটা প্রসেস করা
    // পাবলিক API থেকে আসা ডেটা আপনার ফরম্যাটে সাজানো
    const file = data.list ? data.list[0] : null;

    if (!file) {
      return res.status(404).json({ 
        success: false, 
        error: "No file found", 
        developer: DEVELOPER_NAME 
      });
    }

    // ৫. সফল রেসপন্স
    res.json({
      success: true,
      platform: "terabox",
      developer: DEVELOPER_NAME,
      facebook: FACEBOOK_LINK,
      original_url: url,
      title: file.filename || file.server_filename,
      size: file.size,
      thumbnail: file.thumb || (file.thumbs ? file.thumbs.url3 : null),
      // downloadLink সরাসরি নাও থাকতে পারে, তাই dlink বা direct_link খোঁজা হচ্ছে
      download: file.dlink || file.downloadLink || "Link expired or protected"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Relay Server Error",
      developer: DEVELOPER_NAME,
      details: err.message
    });
  }
}
