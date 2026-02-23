// ============================================================
// RUTAVERDE — Supabase Storage Layer
// Drop-in replacement for window.storage (Claude.ai)
// ============================================================

const SUPABASE_URL = "https://mlbbsdtjhcepqjeaqrej.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sYmJzZHRqaGNlcHFqZWFxcmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjI4MjQsImV4cCI6MjA4NzQzODgyNH0.yXOwyyjHSsZ186AVob1UchSqnUS7RrrZP2Uk5K2xA2l0";

const HEADERS = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": "Bearer " + SUPABASE_ANON_KEY,
  "Content-Type": "application/json",
  "Prefer": "return=minimal"
};

// In-memory cache for fast reads + offline support
const _cache = {};

async function dbGet(key) {
  // Try cache first
  if (_cache[key] !== undefined) {
    return _cache[key];
  }
  try {
    const resp = await fetch(
      SUPABASE_URL + "/rest/v1/kv_store?key=eq." + encodeURIComponent(key) + "&select=value",
      { headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": "Bearer " + SUPABASE_ANON_KEY } }
    );
    if (!resp.ok) return null;
    const rows = await resp.json();
    if (rows.length > 0) {
      _cache[key] = rows[0].value;
      return rows[0].value;
    }
    return null;
  } catch (e) {
    console.warn("dbGet offline, using cache for:", key);
    return _cache[key] || null;
  }
}

async function dbSet(key, value) {
  // Update cache immediately
  _cache[key] = value;
  try {
    const resp = await fetch(
      SUPABASE_URL + "/rest/v1/rpc/upsert_kv",
      {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ p_key: key, p_value: value })
      }
    );
    return resp.ok;
  } catch (e) {
    console.warn("dbSet offline, cached locally:", key);
    return false;
  }
}

// Storage interface matching the app's sLoad/sSave pattern
async function sLoad(key) {
  try {
    const val = await dbGet(key);
    return val || null;
  } catch (e) {
    console.error("sLoad error:", key, e);
    return null;
  }
}

async function sSave(key, data) {
  try {
    return await dbSet(key, data);
  } catch (e) {
    console.error("sSave error:", key, e);
    return false;
  }
}

// Preload all keys into cache (call on app init for offline support)
async function preloadCache(keys) {
  try {
    const keyList = keys.map(k => '"' + k + '"').join(",");
    const resp = await fetch(
      SUPABASE_URL + "/rest/v1/kv_store?key=in.(" + encodeURIComponent(keyList.replace(/"/g, '"')) + ")&select=key,value",
      { headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": "Bearer " + SUPABASE_ANON_KEY } }
    );
    if (resp.ok) {
      const rows = await resp.json();
      rows.forEach(r => { _cache[r.key] = r.value; });
    }
  } catch (e) {
    console.warn("preloadCache failed (offline?):", e);
  }
}

// Export for use in HTML script tags
window.RVStorage = { sLoad, sSave, preloadCache, dbGet, dbSet };
