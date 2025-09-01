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
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
  const [lat, setLat] = useState(25.329);
  const [lng, setLng] = useState(55.385);
  const [duration, setDuration] = useState(120);
  const [start, setStart] = useState(new Date().toISOString().slice(0,16)); // yyyy-MM-ddTHH:mm
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true); setErr(null);
      const iso = new Date(start).toISOString();
      const url = `${API_BASE}/predict?lat=${lat}&lng=${lng}&start=${encodeURIComponent(iso)}&duration=${duration}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`API ${r.status}`);
      const j = await r.json();
      setData(j);
    } catch (e:any) {
      setErr(e.message || "Failed to fetch");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* run once on load */ }, []);

  return (
    <main style={{fontFamily:"system-ui", padding: 20, maxWidth: 820, margin: "0 auto"}}>
      <h1 style={{fontSize: 28, marginBottom: 12}}>🚗 Majaz 3 Parking Insights</h1>

      {/* Controls */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, marginBottom:16}}>
        <div>
          <label>Lat</label>
          <input value={lat} onChange={e=>setLat(parseFloat(e.target.value))}
                 style={{width:"100%"}} type="number" step="0.0001"/>
        </div>
        <div>
          <label>Lng</label>
          <input value={lng} onChange={e=>setLng(parseFloat(e.target.value))}
                 style={{width:"100%"}} type="number" step="0.0001"/>
        </div>
        <div>
          <label>Start (local)</label>
          <input value={start} onChange={e=>setStart(e.target.value)}
                 style={{width:"100%"}} type="datetime-local"/>
        </div>
        <div>
          <label>Duration (mins)</label>
          <input value={duration} onChange={e=>setDuration(parseInt(e.target.value||"0"))}
                 style={{width:"100%"}} type="number" min={15} step={15}/>
        </div>
      </div>

      <button onClick={fetchData}
              style={{padding:"8px 12px", borderRadius:10, border:"1px solid #ddd"}}>
        Refresh
      </button>

      {loading && <p style={{marginTop:12}}>Loading…</p>}
      {err && <p style={{marginTop:12, color:"#c00"}}>Error: {err}</p>}

      {data && (
        <div style={{border:"1px solid #ddd", borderRadius:12, padding:16, marginTop:12,
                     boxShadow:"0 6px 16px rgba(0,0,0,0.06)"}}>
          <div><b>Likelihood:</b> {data.score} ({Math.round((data.confidence||0)*100)}%)</div>
          <div style={{marginTop:8}}><b>Recommended Lot:</b> {data.lot?.name}</div>
          <div style={{marginTop:8}}><b>Alternatives:</b>
            <ul>{(data.alternatives||[]).map(a=>(
              <li key={a.lot_id}>{a.name} • {a.walk_mins} min • {a.score}</li>
            ))}</ul>
          </div>
          <div style={{marginTop:8}}>
            <b>Pricing:</b> {data.pricing?.best_option} <i>({data.pricing?.notes})</i>
          </div>
        </div>
      )}
    </main>
  );
}
