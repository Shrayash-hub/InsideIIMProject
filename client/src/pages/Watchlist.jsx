import { Link } from "react-router-dom";
import { TrendingUp, Trash2, BookMarked, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useWatchlist } from "../hooks/useWatchlist.js";

const serif = (sz, color = "#2C2C2C") => ({
  fontFamily: "Times New Roman, Times, serif",
  fontSize: sz,
  fontWeight: 700,
  color,
  margin: 0,
});
const sans = (sz, color = "#4A4A4A") => ({
  fontFamily: "Arial, sans-serif",
  fontSize: sz,
  color,
  margin: 0,
  lineHeight: 1.5,
});

const VERDICT_STYLE = {
  INVEST: { color: "#2d5a27", background: "#E8F0E6", border: "1px solid #A8C0A0" },
  PASS:   { color: "#9B2C2C", background: "#FDF0F0", border: "1px solid #E8B0B0" },
  WATCH:  { color: "#92620A", background: "#FFFBF0", border: "1px solid #E8D0A0" },
};

export default function Watchlist() {
  const { currentUser } = useAuth();
  const { watchlist, loading, removeFromWatchlist } = useWatchlist();

  return (
    <div style={{ minHeight: "100vh", background: "#E2E2E2", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ background: "#4E5944", borderBottom: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 72 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp style={{ width: 16, height: 16, color: "#fff" }} />
            </div>
            <p style={{ ...serif(22, "#fff"), letterSpacing: "0.08em" }}>ARIA</p>
          </Link>
          <Link to="/settings" style={{ ...sans(12, "rgba(255,255,255,0.85)"), textDecoration: "none", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {currentUser?.name ?? currentUser?.email}
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 1000, margin: "0 auto", width: "100%", padding: "40px 24px" }}>
        {/* Page title */}
        <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BookMarked style={{ width: 20, height: 20, color: "#4E5944" }} />
            <h2 style={{ ...serif(28, "#2C2C2C") }}>My Watchlist</h2>
          </div>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, ...sans(12, "#4E5944"), fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            New Research <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 28, height: 28, border: "3px solid #C8C8C8", borderTopColor: "#4E5944", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : watchlist.length === 0 ? (
          <div style={{ background: "#FFFFFF", border: "1px solid #C8C8C8", padding: "56px 32px", textAlign: "center" }}>
            <BookMarked style={{ width: 36, height: 36, color: "#C8C8C8", margin: "0 auto 16px" }} />
            <p style={{ ...serif(20, "#2C2C2C"), marginBottom: 8 }}>No companies saved yet</p>
            <p style={{ ...sans(14, "#6B6B6B"), marginBottom: 24 }}>Run a research report and save companies to track them here.</p>
            <Link to="/" className="corp-btn-primary" style={{ display: "inline-block", padding: "10px 24px", textDecoration: "none" }}>
              Start Researching
            </Link>
          </div>
        ) : (
          <div style={{ background: "#FFFFFF", border: "1px solid #C8C8C8", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <table className="corp-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Ticker</th>
                  <th>Exchange</th>
                  <th>Verdict</th>
                  <th>AI Score</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((item) => {
                  const vs = VERDICT_STYLE[item.verdict] ?? VERDICT_STYLE.WATCH;
                  return (
                    <tr key={item.$id}>
                      <td style={{ ...sans(13, "#2C2C2C"), fontWeight: 600 }}>{item.companyName}</td>
                      <td style={{ fontFamily: "Courier Margin, monospace", fontSize: 13, fontWeight: 700, color: "#4E5944" }}>{item.symbol}</td>
                      <td style={{ ...sans(12, "#6B6B6B") }}>{item.exchange ?? "—"}</td>
                      <td>
                        {item.verdict && (
                          <span style={{ ...sans(10, vs.color), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", padding: "2px 8px", ...vs }}>
                            {item.verdict}
                          </span>
                        )}
                      </td>
                      <td style={{ fontFamily: "Courier New, monospace", fontSize: 13, color: "#4E5944", fontWeight: 700 }}>
                        {item.confidenceScore ? `${item.confidenceScore}%` : "—"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => removeFromWatchlist(item.$id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#9B2C2C", padding: 4, display: "inline-flex" }}
                          title="Remove from watchlist"
                        >
                          <Trash2 style={{ width: 15, height: 15 }} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
