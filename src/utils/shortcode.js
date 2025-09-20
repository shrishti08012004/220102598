// helper for generating and validating shortcodes
const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateRandomShortcode(length = 6) {
  let s = "";
  for (let i = 0; i < length; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return s;
}

export function isValidCustomShortcode(code) {
  // only alphanumeric, length 3-20
  return /^[A-Za-z0-9]{3,20}$/.test(code);
}

export function isValidUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
