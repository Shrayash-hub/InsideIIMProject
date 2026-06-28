import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, User, LogOut, BookMarked, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

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

function SettingRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #E8E8E8" }}>
      <span style={{ ...sans(12, "#6B6B6B"), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
      <span style={{ ...sans(13, "#2C2C2C"), fontFamily: "Courier New, monospace" }}>{value}</span>
    </div>
  );
}

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch {
      setLoggingOut(false);
    }
  };

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() ?? "U";

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
          <Link to="/watchlist" style={{ ...sans(12, "rgba(255,255,255,0.85)"), textDecoration: "none", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6 }}>
            <BookMarked style={{ width: 14, height: 14 }} /> Watchlist
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 640, margin: "0 auto", width: "100%", padding: "40px 24px" }}>
        <h2 style={{ ...serif(28, "#2C2C2C"), marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
          <ShieldCheck style={{ width: 22, height: 22, color: "#4E5944" }} />
          Account Settings
        </h2>

        {/* Profile card */}
        <div style={{ background: "#FFFFFF", border: "1px solid #C8C8C8", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          {/* Card header */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #E8E8E8", display: "flex", alignItems: "center", gap: 6 }}>
            <User style={{ width: 14, height: 14, color: "#6B6B6B" }} />
            <span style={{ ...sans(10, "#6B6B6B"), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Profile</span>
          </div>

          <div style={{ padding: "8px 24px 20px" }}>
            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 0 16px", borderBottom: "1px solid #E8E8E8", marginBottom: 4 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#4E5944", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>{initials}</span>
              </div>
              <div>
                <p style={{ ...serif(18, "#2C2C2C"), marginBottom: 2 }}>{currentUser?.name ?? "—"}</p>
                <p style={{ ...sans(12, "#6B6B6B") }}>{currentUser?.email}</p>
              </div>
            </div>

            <SettingRow label="User ID" value={currentUser?.$id?.slice(0, 16) + "…"} />
            <SettingRow label="Account Created" value={currentUser?.$createdAt ? new Date(currentUser.$createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"} />
          </div>
        </div>

        {/* Logout card */}
        <div style={{ background: "#FFFFFF", border: "1px solid #C8C8C8", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "24px" }}>
          <p style={{ ...serif(16, "#2C2C2C"), marginBottom: 8 }}>Sign Out</p>
          <p style={{ ...sans(13, "#6B6B6B"), marginBottom: 20 }}>You'll be redirected to the login page and your session will be cleared.</p>
          <button
            id="settings-logout"
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#FDF0F0",
              color: "#9B2C2C",
              border: "1px solid #E8B0B0",
              fontFamily: "Arial, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "10px 20px",
              cursor: loggingOut ? "not-allowed" : "pointer",
              opacity: loggingOut ? 0.6 : 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { if (!loggingOut) e.currentTarget.style.background = "#FCE8E8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FDF0F0"; }}
          >
            <LogOut style={{ width: 14, height: 14 }} />
            {loggingOut ? "Signing Out…" : "Sign Out"}
          </button>
        </div>
      </main>
    </div>
  );
}
