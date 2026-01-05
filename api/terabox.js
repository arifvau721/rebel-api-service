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
    // ২. শর্ট লিঙ্ক ID বের করা
    // যেমন: https://terabox.com/s/1ABcDe... -> 1ABcDe...
    let shortKey = "";
    if (url.includes("/s/")) {
      shortKey = url.split("/s/")[1];
    } else {
      shortKey = url.split("/").pop();
    }

    // ৩. আপনার দেওয়া API ব্যবহার করা (Password ফাকা রাখা হয়েছে)
    const apiUrl = `https://terabox.hnn.workers.dev/api/get-info-new?shorturl=${shortKey}&pwd=`;

    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const data = response.data;

    // ৪. ডেটা চেক করা
    // এই API সাধারণত TeraBox এর অরিজিনাল JSON রিটার্ন করে
    if (!data.list || data.list.length === 0) {
      return res.status(404).json({
        success: false,
        error: "File not found or Link Expired",
        developer: DEVELOPER_NAME
      });
    }

    // ৫. ফাইল ইনফো নেওয়া
    const file = data.list[0];

    // ৬. সাকসেস রেসপন্স
    res.json({
      success: true,
      platform: "terabox",
      developer: DEVELOPER_NAME,
      facebook: FACEBOOK_LINK,
      original_url: url,
      title: file.server_filename, // ফাইলের নাম
      size: file.size,             // সাইজ (বাইট)
      thumbnail: file.thumbs ? file.thumbs.url3 : null, // থাম্বনেইল
      download: file.dlink         // ডাইরেক্ট ডাউনলোড লিঙ্ক
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Worker API Error",
      developer: DEVELOPER_NAME,
      details: err.message
    });
  }
}
