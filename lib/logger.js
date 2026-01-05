export function log(type, message, ip = "") {
  console.log(
    `[${new Date().toISOString()}] [${type}] ${message}${
      ip ? " | IP:" + ip : ""
    }`
  );
}
