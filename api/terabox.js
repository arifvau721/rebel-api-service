import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "Missing terabox url",
      example: "/api/terabox?url=YOUR_TERABOX_LINK"
    });
  }

  try {
    // call 1024teradownloader with url
    const { data: html } = await axios.get(
      "https://1024teradownloader.com/",
      {
        params: { url },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      }
    );

    /* ===============================
        SEARCH DOWNLOAD LINKS
       =============================== */

    // direct download (video / file)
    const matchDownload =
      html.match(/href="(https:\/\/[^"]*?download[^"]+)"/) ||
      html.match(/href="(https:\/\/terabox\.com\/s\/[^"]+\/download[^"]+)"/);

    // get title
    const matchTitle = html.match(
      /<title>([^<]+)<\/title>/
    );

    const downloadLink = matchDownload ? matchDownload[1] : null;
    const title = matchTitle ? matchTitle[1].trim() : null;

    if (!downloadLink) {
      return res.status(500).json({
        success: false,
        error: "Failed to extract download link (HTML changed?)",
        raw: html.slice(0, 200)
      });
    }

    res.json({
      success: true,
      platform: "terabox",
      original_url: url,
      title,
      download: downloadLink
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Terabox proxy error",
      details: err.message
    });
  }
}
