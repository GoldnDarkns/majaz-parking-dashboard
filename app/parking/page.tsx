"use client";
import { useEffect, useState } from "react";

type Result = {
  score: string;
  confidence: number;
  lot?: { name: string; lat: number; lng: number };
  alternatives?: { lot_id: string; name: string; walk_mins: number; score: string }[];
  pricing?: { best_option: string; notes?: string };
};

export default function ParkingInsights() {
  // ✅ Fallback API base
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ||
    "https://<your-current>.replit.dev"; // replace with your actual Replit API URL

  const [lat, setLat] = useState(25.329);
  const [lng, setLng] = useState(55.385);
  const [duration, setDuration] = useState(120);
  const [start, setStart] = useState(new Date().toISOString().slice(0, 16)); // yyyy-MM-ddTHH:mm
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErr(null);

      const iso = new Date(start).toISOString();
      const qs = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        start: iso,
        duration: String(duration),
      });
      const url = `${API_BASE}/predict?${qs.toString()}`;
      console.log("Fetching:", url);

      const r = await fetch(url);
      const text = await r.text();
      if (!r.ok) throw new Error(`API ${r.status} – ${text.slice(0, 200)}`);
      const j = JSON.parse(text);
      setData(j);
    } catch (e: any) {
      setErr(e.message || "Failed to fetch");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once on load
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Auto-refresh when inputs change
  useEffect(() => {
    const id = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, start, duration]);

  return (
    <main style={{ fontFamily: "system-ui", padding: 20, maxWidth: 820, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>🚗 Majaz 3 Parking Insights</h1>

      {/* Controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <label>Lat</label>
          <input
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value))}
            style={{ width: "100%" }}
            type="number"
            step="0.0001"
          />
        </div>
        <div>
          <label>Lng</label>
          <input
            value={lng}
            onChange={(e) => setLng(parseFloat(e.target.value))}
            style={{ width: "100%" }}
            type="number"
            step="0.0001"
          />
        </div>
        <div>
          <label>Start (local)</label>
          <input
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ width: "100%" }}
            type="datetime-local"
          />
        </div>
        <div>
          <label>Duration (mins)</label>
          <input
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value || "0"))}
            style={{ width: "100%" }}
            type="number"
            min={15}
            step={15}
          />
        </div>
      </div>

      <button
        onClick={fetchData}
        disabled={loading}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Refreshing…" : "Refresh"}
      </button>

      {/* ✅ Mini map preview */}
      <iframe
        style={{ width: "100%", height: 300, border: 0, borderRadius: 12, marginTop: 12 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
      />

      {loading && <p style={{ marginTop: 12 }}>Loading…</p>}
      {err && <p style={{ marginTop: 12, color: "#c00" }}>Error: {err}</p>}

      {data && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 16,
            marginTop: 12,
            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
          }}
        >
          <div>
            <b>Likelihood:</b> {data.score} ({Math.round((data.confidence || 0) * 100)}%)
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Recommended Lot:</b> {data.lot?.name}
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Alternatives:</b>
            <ul>
              {(data.alternatives || []).map((a) => (
                <li key={a.lot_id} style={{ marginBottom: 6 }}>
                  {a.name} • {a.walk_mins} min • {a.score}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      a.name
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: 8 }}
                  >
                    (Open in Maps)
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Pricing:</b> {data.pricing?.best_option} <i>({data.pricing?.notes})</i>
          </div>
        </div>
      )}
    </main>
  );
}
