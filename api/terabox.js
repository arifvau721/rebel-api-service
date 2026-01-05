import axios from "axios";

// 🛠️ কনফিগারেশন
const COOKIE = process.env.TERABOX_COOKIE || "YuOVc6pteHuiMOGNcyu4WTrVXbpo43QrV92C8u8x"; 
const DEVELOPER_NAME = "Md Aiful Islam Asif";
const FACEBOOK_LINK = "https://facebook.com/your_id";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url", developer: DEVELOPER_NAME });
  }

  try {
    let shortKey = "";
    if (url.includes("/s/")) {
      shortKey = url.split("/s/")[1];
    } else {
      shortKey = url.split("/").pop(); 
    }

    // 👇 নতুন কনফিগারেশন: আমরা মোবাইল ইউজার সেজে রিকোয়েস্ট পাঠাবো
    const apiUrl = `https://www.terabox.com/api/shorturlinfo?app_id=250528&shorturl=${shortKey}&root=1`;

    const response = await axios.get(apiUrl, {
      headers: {
        // ১. User-Agent পরিবর্তন করে লেটেস্ট ক্রোম ব্রাউজার দেওয়া হলো
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        
        // ২. কুকি বসানো
        "Cookie": `ndus=${COOKIE}; browserid=built-in-browser;`, 
        
        // ৩. এক্সট্রা হেডার্স যা বট ডিটেকশন এড়াতে সাহায্য করে
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.terabox.com/sharing/link?surl=" + shortKey,
        "Origin": "https://www.terabox.com",
        "Host": "www.terabox.com",
        "Connection": "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      }
    });

    const data = response.data;

    // ডিবাগিং: কনসোলে পুরো ডাটা দেখুন যদি আবার এরর আসে
    // console.log("TeraBox Response:", JSON.stringify(data, null, 2));

    if (data.errno !== 0) {
      // যদি এখনো verify_v2 চায়, তার মানে এই কুকি দিয়ে সার্ভার থেকে আর কাজ হবে না
      return res.status(400).json({
        success: false,
        error: "Failed. TeraBox blocked the request (Anti-Bot Triggered).",
        terabox_msg: data.errmsg, // আসল এরর মেসেজ
        developer: DEVELOPER_NAME
      });
    }

    const fileList = data.list;
    if (!fileList || fileList.length === 0) {
      return res.status(404).json({ success: false, error: "No file found", developer: DEVELOPER_NAME });
    }

    const file = fileList[0];

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
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
      developer: DEVELOPER_NAME,
      details: err.message
    });
  }
}
