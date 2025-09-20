// localStorage based storage for url mappings
const MAP_KEY = "url_shortener_mappings";

/*
Mapping structure (object):
{
  "<shortcode>": {
    originalUrl: "https://...",
    shortcode: "abcd12",
    createdAt: 1670000000000, // ms
    ttlMinutes: 30,
    expiresAt: 1670000000000 + ttl*60000,
    clicks: 0,
    custom: true|false
  },
  ...
}
*/

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(MAP_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAll(obj) {
  localStorage.setItem(MAP_KEY, JSON.stringify(obj));
}

export function getMapping(code) {
  const all = loadAll();
  return all[code] || null;
}

export function listMappings() {
  const all = loadAll();
  // convert to array and sort by newest
  return Object.values(all).sort((a, b) => b.createdAt - a.createdAt);
}

export function addMapping(mapping) {
  const all = loadAll();
  if (all[mapping.shortcode]) {
    throw new Error("Shortcode already exists");
  }
  all[mapping.shortcode] = mapping;
  saveAll(all);
}

export function updateMapping(code, patch) {
  const all = loadAll();
  if (!all[code]) throw new Error("Not found");
  all[code] = { ...all[code], ...patch };
  saveAll(all);
}

export function removeMapping(code) {
  const all = loadAll();
  if (all[code]) {
    delete all[code];
    saveAll(all);
  }
}

export function incrementClicks(code) {
  const all = loadAll();
  if (all[code]) {
    all[code].clicks = (all[code].clicks || 0) + 1;
    saveAll(all);
  }
}
