import { motion } from "framer-motion";
import { Copy, Check, BookMarked } from "lucide-react";
import { useState } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { useWatchlist } from "../hooks/useWatchlist.js";
import { useAuth } from "../context/AuthContext.jsx";
import { cn } from "../lib/utils.js";
import { useCountUp } from "../hooks/useCountUp.js";

const VERDICT_CONFIG = {
  INVEST: {
    bg: "#F0F7F0",
    border: "#4E5944",
    accent: "#2d5a27",
    text: "#2d5a27",
    ring: "#4E5944",
    label: "INVEST",
  },
  PASS: {
    bg: "#FDF0F0",
    border: "#9B2C2C",
    accent: "#9B2C2C",
    text: "#9B2C2C",
    ring: "#C53030",
    label: "PASS",
  },
  WATCH: {
    bg: "#FFFBF0",
    border: "#B7791F",
    accent: "#B7791F",
    text: "#92620A",
    ring: "#D69E2E",
    label: "WATCH",
  },
};

export default function VerdictCard({ report }) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const { addToWatchlist, watchlist } = useWatchlist();
  const { currentUser } = useAuth();

  if (!report) return null;

  const { verdict, confidenceScore, reasoning, companyName, ticker, exchange } = report;
  const config = VERDICT_CONFIG[verdict] ?? VERDICT_CONFIG.WATCH;

  const isSaved = watchlist.some((item) => 
    (ticker && item.ticker === ticker) || 
    item.companyName === companyName
  );

  const animatedScore = useCountUp({
    end: confidenceScore ?? 0,
    duration: 1500,
    enabled: true,
  });

  const chartData = [{ name: "confidence", value: confidenceScore ?? 0, fill: config.ring }];

  const handleCopy = async () => {
    const text = `Verdict: ${verdict}\nConfidence: ${confidenceScore}%\n\n${reasoning}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ width: "100%", maxWidth: "100%", margin: "0 auto 24px", padding: 0, boxSizing: "border-box" }}
    >
      <div
        className="verdict-pulse"
        style={{
          background: config.bg,
          border: "1px solid #C8C8C8",
          borderLeft: `5px solid ${config.border}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          padding: "32px 36px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 160px", gap: 32, alignItems: "center" }}>
          {/* Left — verdict */}
          <div>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6B6B6B", margin: "0 0 8px", fontWeight: 700 }}>
              Verdict
            </p>
            <h2 style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 52, fontWeight: 700, color: config.text, margin: "0 0 8px", lineHeight: 1 }}>
              {verdict}
            </h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#6B6B6B", margin: 0 }}>
              {companyName}
              {ticker && (
                <span style={{ fontFamily: "Courier New, monospace", marginLeft: 6 }}>
                  · {ticker}{exchange ? ` (${exchange})` : ""}
                </span>
              )}
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderLeft: "1px solid #D0D0D0", paddingLeft: 32 }}>
            <p style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 15, color: "#4A4A4A", lineHeight: 1.75, fontStyle: "italic", margin: "0 0 16px" }}>
              {reasoning}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={handleCopy}
                className="corp-btn-gray"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
                {copied ? "Copied!" : "Copy Summary"}
              </button>
              
              {currentUser && (
                <button
                  onClick={async () => {
                    if (isSaved || saving) return;
                    setSaving(true);
                    await addToWatchlist(report);
                    setSaving(false);
                  }}
                  disabled={isSaved || saving}
                  className="corp-btn-outline"
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6,
                    color: isSaved ? "#6B6B6B" : "#4E5944",
                    borderColor: isSaved ? "#D0D0D0" : "#4E5944",
                    background: isSaved ? "#FAFAFA" : "transparent",
                    cursor: isSaved ? "default" : "pointer"
                  }}
                >
                  {isSaved ? <Check style={{ width: 13, height: 13 }} /> : <BookMarked style={{ width: 13, height: 13 }} />}
                  {isSaved ? "Saved to Watchlist" : saving ? "Saving..." : "Save to Watchlist"}
                </button>
              )}
            </div>
          </div>

          {/* Right — confidence ring */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6B6B6B", margin: "0 0 8px", fontWeight: 700 }}>
              Confidence
            </p>
            <div style={{ width: 110, height: 110, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="72%" outerRadius="100%"
                  barSize={8}
                  data={chartData}
                  startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background={{ fill: "#E0E0E0" }}
                    dataKey="value"
                    cornerRadius={2}
                    fill={config.ring}
                    isAnimationActive
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Courier New, monospace", fontSize: 22, fontWeight: 700, color: "#2C2C2C" }}>
                  {animatedScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
