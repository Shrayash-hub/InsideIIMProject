import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { useResearch } from "../hooks/useResearch.js";
import { cn } from "../lib/utils.js";

const EXAMPLES = ["Apple", "Tesla", "Nvidia", "Infosys", "Reliance"];
const RISK_LEVELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function SearchBar({ compact = false }) {
  const { state, startResearch } = useResearch();
  const [company, setCompany] = useState("");
  const [riskAppetite, setRiskAppetite] = useState("medium");
  const riskRef = useRef(null);

  const isLoading = state.status === "loading";

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = company.trim();
    if (!name || isLoading) return;
    startResearch(name, riskAppetite);
  };

  const handleChipClick = (name) => {
    if (isLoading) return;
    setCompany(name);
    startResearch(name, riskAppetite);
  };

  return (
    <motion.div
      layout
      style={{ width: "100%", maxWidth: compact ? "100%" : 680, margin: "0 auto", position: "relative", zIndex: 10, padding: compact ? "0 24px" : "0" }}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Search input */}
        <div style={{ position: "relative" }}>
          <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#A0A0A0" }} />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter company name (e.g. Apple, Tesla, Infosys)"
            disabled={isLoading}
            className="input-glow"
            style={{
              width: "100%",
              paddingLeft: 44,
              paddingRight: 16,
              paddingTop: 14,
              paddingBottom: 14,
              background: "#FFFFFF",
              border: "1px solid #C8C8C8",
              borderRadius: 0,
              color: "#2C2C2C",
              fontFamily: "Arial, sans-serif",
              fontSize: 15,
              outline: "none",
              opacity: isLoading ? 0.6 : 1,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          />
        </div>

        {/* Risk appetite row */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B6B6B", fontWeight: 700 }}>
            Risk Appetite
          </span>
          <div ref={riskRef} style={{ display: "flex", border: "1px solid #C8C8C8", background: "#F5F5F5" }}>
            {RISK_LEVELS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                disabled={isLoading}
                onClick={() => setRiskAppetite(value)}
                style={{
                  padding: "6px 18px",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  borderRight: value !== "high" ? "1px solid #C8C8C8" : "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  background: riskAppetite === value ? "#4E5944" : "transparent",
                  color: riskAppetite === value ? "#FFFFFF" : "#6B6B6B",
                  transition: "background 0.15s, color 0.15s",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !company.trim()}
          className="corp-btn-primary"
          style={{
            width: "100%",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 14,
          }}
        >
          {isLoading ? (
            <>
              <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />
              Researching…
            </>
          ) : (
            "Start Research"
          )}
        </button>
      </form>

      {/* Example chips */}
      {!compact && (
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#6B6B6B", alignSelf: "center", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Try:
          </span>
          {EXAMPLES.map((name) => (
            <button
              key={name}
              type="button"
              disabled={isLoading}
              onClick={() => handleChipClick(name)}
              className="corp-btn-gray"
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
