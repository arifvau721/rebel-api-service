export default function handler(req, res) {
  const { url, provider } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "Missing terabox url",
      usage: "/api/terabox?url=TERABOX_LINK&provider=fast|1024"
    });
  }

  let redirectUrl;

  if (provider === "1024") {
    redirectUrl =
      "https://1024teradownloader.com/?url=" +
      encodeURIComponent(url);
  } else {
    redirectUrl =
      "https://www.teraboxfast.com/p/view.html?q=" +
      encodeURIComponent(url);
  }

  res.writeHead(302, { Location: redirectUrl });
  res.end();
}
