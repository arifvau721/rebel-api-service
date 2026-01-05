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
    // ১. শর্ট লিঙ্ক থেকে ID বের করা
    let shortKey = "";
    if (url.includes("/s/")) {
      shortKey = url.split("/s/")[1];
    } else {
      shortKey = url.split("/").pop(); 
    }

    // ২. ⚠️ নতুন কৌশল: 'shorturlinfo' এর বদলে 'share/list' ব্যবহার করা
    // এটি সাধারণত কম ব্লক খায়
    const apiUrl = `https://www.terabox.com/share/list?app_id=250528&shorturl=${shortKey}&root=1`;

    const response = await axios.get(apiUrl, {
      headers: {
        // ৩. নিজেকে মোবাইল অ্যাপ হিসেবে পরিচয় দেওয়া
        "User-Agent": "TeraBox/1.32.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
        "Cookie": `ndus=${COOKIE};`,
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.terabox.com/wap/share/filelist", // মোবাইল সাইট রেফারার
        "Host": "www.terabox.com"
      }
    });

    const data = response.data;

    // ৪. রেসপন্স চেক করা
    // share/list এর ক্ষেত্রে errno 0 হলে সফল
    if (data.errno !== 0) {
      return res.status(403).json({
        success: false,
        error: "Still blocked or Invalid Link. Server IP might be blacklisted.",
        terabox_msg: data.errmsg || "Unknown Error",
        developer: DEVELOPER_NAME
      });
    }

    const fileList = data.list;
    if (!fileList || fileList.length === 0) {
      return res.status(404).json({ success: false, error: "No file found", developer: DEVELOPER_NAME });
    }

    const file = fileList[0];

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
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
      developer: DEVELOPER_NAME,
      details: err.message
    });
  }
}
