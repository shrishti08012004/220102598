// logger.js
// Minimal logger that does NOT use console.log (stores logs in localStorage).
// Replace this file with the official Logging Middleware given to you in the pre-test.

const LOG_KEY = "url_shortener_logs";

function _push(level, msg, meta = {}) {
  try {
    const logs = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    logs.push({
      ts: new Date().toISOString(),
      level,
      msg,
      meta
    });
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  } catch (e) {
    // swallow errors to avoid using console
  }
}

export default {
  info: (msg, meta) => _push("info", msg, meta),
  warn: (msg, meta) => _push("warn", msg, meta),
  error: (msg, meta) => _push("error", msg, meta)
};
