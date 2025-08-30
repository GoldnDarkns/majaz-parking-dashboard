"use client";
import { useEffect, useState } from "react";

export default function ParkingInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ⬇️ Replace this with your actual Replit API URL (no trailing slash)
  const API_BASE = "https://0fc9d3d2-012b-465b-8d9f-034278c7570d-00-34k4nj9bc7d90.sisko.replit.dev"

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const now = new Date().toISOString();
      const url = `${API_BASE}/predict?lat=25.329&lng=55.385&start=${encodeURIComponent(now)}&duration=120`;
      const r = await fetch(url);
      const j = await r.json();
      setData(j);
      setLoading(false);
    };
    run();
  }, []);

  return (
    <main style={{fontFamily:"system-ui", padding: 20, maxWidth: 760, margin: "0 auto"}}>
      <h1 style={{fontSize: 28, marginBottom: 12}}>🚗 Majaz 3 Parking Insights</h1>

      {loading && <p>Loading…</p>}

      {!loading && data && (
        <div style={{
          border:"1px solid #ddd",
          borderRadius:12,
          padding:16,
          boxShadow:"0 6px 16px rgba(0,0,0,0.06)"
        }}>
          <div><b>Likelihood:</b> {data.score} ({Math.round((data.confidence||0)*100)}%)</div>
          <div style={{marginTop:8}}><b>Recommended Lot:</b> {data.lot?.name}</div>

          <div style={{marginTop:8}}>
            <b>Alternatives:</b>
            <ul>
              {(data.alternatives||[]).map((a:any)=>(
                <li key={a.lot_id}>{a.name} • {a.walk_mins} min • {a.score}</li>
              ))}
            </ul>
          </div>

          <div style={{marginTop:8}}>
            <b>Pricing:</b> {data.pricing?.best_option} 
            <i> ({data.pricing?.notes})</i>
          </div>
        </div>
      )}
    </main>
  );
}
