// ============================================================
// RUTAVERDE — Supabase Storage Layer (v2)
// ============================================================

const SUPABASE_URL = "https://mlbbsdtjhcepqjeaqrej.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sYmJzZHRqaGNlcHFqZWFxcmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjI4MjQsImV4cCI6MjA4NzQzODgyNH0.yXOwyyjHSsZ86AVob1UchSqnUS7RrrZP2Uk5K2xA2l0";

var _H = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": "Bearer " + SUPABASE_ANON_KEY,
  "Content-Type": "application/json"
};

var _cache = {};

async function sLoad(key) {
  if (_cache[key] !== undefined) return _cache[key];
  try {
    var resp = await fetch(
      SUPABASE_URL + "/rest/v1/kv_store?key=eq." + encodeURIComponent(key) + "&select=value",
      { headers: _H }
    );
    if (!resp.ok) {
      console.error("sLoad error:", resp.status, key);
      return null;
    }
    var rows = await resp.json();
    if (rows.length > 0 && rows[0].value != null) {
      _cache[key] = rows[0].value;
      return rows[0].value;
    }
    return null;
  } catch (e) {
    console.warn("sLoad offline:", key, e);
    return _cache[key] || null;
  }
}

async function sSave(key, data) {
  _cache[key] = data;
  try {
    // Upsert via PostgREST: POST with on_conflict resolution
    var resp = await fetch(
      SUPABASE_URL + "/rest/v1/kv_store",
      {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates,return=minimal"
        },
        body: JSON.stringify({
          key: key,
          value: data,
          updated_at: new Date().toISOString()
        })
      }
    );
    if (!resp.ok) {
      var errText = await resp.text();
      console.error("sSave error:", resp.status, key, errText);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("sSave offline:", key, e);
    return false;
  }
}

async function preloadCache(keys) {
  try {
    var filter = "(" + keys.map(function(k){ return '"' + k + '"'; }).join(",") + ")";
    var resp = await fetch(
      SUPABASE_URL + "/rest/v1/kv_store?key=in." + filter + "&select=key,value",
      { headers: _H }
    );
    if (resp.ok) {
      var rows = await resp.json();
      rows.forEach(function(r) { if (r.value != null) _cache[r.key] = r.value; });
      console.log("RVStorage: loaded", rows.length, "keys");
    } else {
      console.error("preloadCache error:", resp.status);
    }
  } catch (e) {
    console.warn("preloadCache offline:", e);
  }
}

window.RVStorage = { sLoad: sLoad, sSave: sSave, preloadCache: preloadCache };
