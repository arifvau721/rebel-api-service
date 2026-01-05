import axios from "axios";

// ==========================================
// 🛠️ কনফিগারেশন (আপনার নাম ও লিঙ্ক এখানে দিন)
// ==========================================
const COOKIE = process.env.TERABOX_COOKIE || "YuOVc6pteHuiMOGNcyu4WTrVXbpo43QrV92C8u8x"; 
const DEVELOPER_NAME = "Md Aiful Islam Asif"; // আপনার নাম
const FACEBOOK_LINK = "https://facebook.com/your_id"; // আপনার ফেসবুক লিঙ্ক

export default async function handler(req, res) {
  const { url } = req.query;

  // ১. ইনপুট ভ্যালিডেশন
  if (!url) {
    return res.status(400).json({
      success: false,
      error: "Missing terabox url",
      developer: DEVELOPER_NAME, // এরর হলেও নাম দেখাবে
      example: "/api/terabox?url=YOUR_TERABOX_LINK"
    });
  }

  try {
    // ২. শর্ট লিঙ্ক থেকে ID বের করা
    let shortKey = "";
    if (url.includes("/s/")) {
      shortKey = url.split("/s/")[1];
    } else {
      shortKey = url.split("/").pop(); 
    }

    // ৩. TeraBox API কল করা
    const apiUrl = `https://www.terabox.com/api/shorturlinfo?app_id=250528&shorturl=${shortKey}&root=1`;

    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Cookie": `ndus=${COOKIE};`,
        "Referer": "https://www.terabox.com/",
        "Accept": "application/json, text/plain, */*"
      }
    });

    const data = response.data;

    // ৪. এরর চেকিং
    if (data.errno !== 0) {
      return res.status(400).json({
        success: false,
        error: "Failed to fetch info. Cookie might be expired or Link is invalid.",
        developer: DEVELOPER_NAME,
        details: data
      });
    }

    // ৫. ফাইল ইনফো এক্সট্র্যাক্ট করা
    const fileList = data.list;
    if (!fileList || fileList.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No file found in this link",
        developer: DEVELOPER_NAME
      });
    }

    const file = fileList[0];

    // ৬. সাকসেস রেসপন্স (নাম ও লিঙ্ক সহ)
    res.json({
      success: true,
      platform: "terabox",
      developer: DEVELOPER_NAME,     // ✅ ডেভেলপার নাম
      facebook: FACEBOOK_LINK,       // ✅ ফেসবুক লিঙ্ক
      original_url: url,
      title: file.server_filename,
      size: file.size, 
      thumbnail: file.thumbs ? file.thumbs.url3 : null,
      download: file.dlink 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
      developer: DEVELOPER_NAME,
      details: err.message
    });
  }
}
