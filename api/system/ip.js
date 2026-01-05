import { getUserIP } from "../../lib/ipDetect.js";

export default function handler(req, res) {
  res.json({
    ip: getUserIP(req),
    ua: req.headers["user-agent"]
  });
}
