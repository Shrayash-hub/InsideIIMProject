import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, AlertCircle, Eye, EyeOff } from "lucide-react";
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

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      const msg = err?.message ?? "";
      if (msg.includes("Invalid credentials") || msg.includes("401")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError(msg || "Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#E2E2E2", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ background: "#4E5944", borderBottom: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", minHeight: 72 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp style={{ width: 16, height: 16, color: "#fff" }} />
            </div>
            <div>
              <p style={{ ...serif(22, "#fff"), letterSpacing: "0.08em" }}>ARIA</p>
              <p style={{ ...sans(10, "rgba(255,255,255,0.75)"), textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 2 }}>AI Research Intelligence Agent</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Card */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #C8C8C8", boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
            {/* Card header bar */}
            <div style={{ background: "#4E5944", padding: "20px 32px" }}>
              <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>
                Investor Access
              </p>
              <h1 style={{ ...serif(24, "#fff") }}>Sign In to ARIA</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: "32px" }}>
              {error && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#FDF0F0", border: "1px solid #E8B0B0", borderLeft: "3px solid #9B2C2C", padding: "12px 14px", marginBottom: 20 }}>
                  <AlertCircle style={{ width: 16, height: 16, color: "#9B2C2C", flexShrink: 0, marginTop: 1 }} />
                  <p style={{ ...sans(13, "#9B2C2C") }}>{error}</p>
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", ...sans(11, "#6B6B6B"), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glow"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #C8C8C8", background: "#FAFAFA", fontFamily: "Arial, sans-serif", fontSize: 13, color: "#2C2C2C", outline: "none", boxSizing: "border-box" }}
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", ...sans(11, "#6B6B6B"), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    type={showPass ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-glow"
                    style={{ width: "100%", padding: "10px 40px 10px 12px", border: "1px solid #C8C8C8", background: "#FAFAFA", fontFamily: "Arial, sans-serif", fontSize: 13, color: "#2C2C2C", outline: "none", boxSizing: "border-box" }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6B6B6B", padding: 0, display: "flex" }}
                  >
                    {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={submitting}
                className="corp-btn-primary"
                style={{ width: "100%", padding: "12px", fontSize: 13 }}
              >
                {submitting ? "Signing In…" : "Sign In"}
              </button>

              <p style={{ ...sans(13, "#6B6B6B"), textAlign: "center", marginTop: 20 }}>
                New to ARIA?{" "}
                <Link to="/signup" style={{ color: "#4E5944", fontWeight: 700, textDecoration: "none" }}>
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
