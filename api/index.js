export default function handler(req, res) {
  res.json({
    name: "Rebel AI API",
    endpoints: [
      "/api/ai/ask?q=hello",
      "/api/system/ip",
      "/api/system/health"
    ]
  });
}
