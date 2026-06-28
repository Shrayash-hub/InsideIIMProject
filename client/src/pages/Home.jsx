import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, AlertCircle, TrendingUp, FileText, BarChart3, Users, Brain, Shield, Zap, Globe, CheckCircle } from "lucide-react";
import SearchBar from "../components/SearchBar.jsx";
import AgentProgress from "../components/AgentProgress.jsx";
import VerdictCard from "../components/VerdictCard.jsx";
import ReportSection from "../components/ReportSection.jsx";
import ReasoningTrace from "../components/ReasoningTrace.jsx";
import KeyInsightsPanel from "../components/KeyInsightsPanel.jsx";
import ResearchSidebar from "../components/ResearchSidebar.jsx";
import { useResearch } from "../hooks/useResearch.js";

const W = { maxWidth: 1400, margin: "0 auto", padding: "0 48px" };

const TICKERS = [
  { s: "S&P 500",   v: "5,487.03",  c: "+0.34%", up: true },
  { s: "NASDAQ",    v: "17,925.12", c: "+0.28%", up: true },
  { s: "NIFTY 50",  v: "23,644.80", c: "-0.12%", up: false },
  { s: "DOW JONES", v: "38,890.22", c: "+0.19%", up: true },
  { s: "GOLD",      v: "$2,319.40", c: "+0.61%", up: true },
  { s: "BITCOIN",   v: "$61,204",   c: "-1.24%", up: false },
];

const FEATURES = [
  { Icon: FileText,   title: "AI Research Reports",   desc: "Institutional-grade reports synthesizing financial data, news sentiment, and competitive intelligence in under 60 seconds." },
  { Icon: BarChart3,  title: "Market Intelligence",   desc: "Real-time financial metrics, price targets, 52-week ranges, and analyst consensus from 50+ global exchanges." },
  { Icon: Users,      title: "Competitor Analysis",   desc: "Automated competitive landscape mapping with market positioning, advantages, and disadvantage scoring." },
  { Icon: Brain,      title: "Portfolio Insights",    desc: "AI-driven verdicts with confidence scoring, risk/reward assessment, and fully explainable reasoning traces." },
];

const WHY = [
  { Icon: Shield,      title: "Institutional-Grade",  desc: "Built to professional fund manager standards. Every report synthesizes multiple verified data sources with systematic rigor." },
  { Icon: Zap,         title: "60-Second Delivery",   desc: "Parallel AI agents research financial data, news, web, and competitive landscape simultaneously — all in under a minute." },
  { Icon: Globe,       title: "Global Coverage",      desc: "10,000+ companies across 50+ exchanges: NYSE, NASDAQ, BSE, NSE, LSE, and major Asian markets." },
  { Icon: CheckCircle, title: "Explainable AI",       desc: "Full agent reasoning trace with every report. Understand exactly how the investment verdict was reached." },
];

const STATS = [
  { v: "10,000+", l: "Companies Covered" }, { v: "50+", l: "Global Exchanges" },
  { v: "< 60s",   l: "Avg. Research Time" }, { v: "Live", l: "Market Data Feed" },
  { v: "A.I.",    l: "Confidence Scoring" }, { v: "SEC/SEBI", l: "Filing Coverage" },
];

const SAMPLES = [
  { co: "Apple Inc.",      ticker: "AAPL",     ex: "NASDAQ", verdict: "INVEST", score: 82 },
  { co: "Microsoft Corp.", ticker: "MSFT",     ex: "NASDAQ", verdict: "INVEST", score: 78 },
  { co: "NVIDIA Corp.",    ticker: "NVDA",     ex: "NASDAQ", verdict: "INVEST", score: 85 },
  { co: "Reliance Ind.",   ticker: "RELIANCE", ex: "NSE",    verdict: "WATCH",  score: 65 },
  { co: "Tesla Inc.",      ticker: "TSLA",     ex: "NASDAQ", verdict: "WATCH",  score: 58 },
];

const VS = {
  INVEST: { color: "#2d5a27", bg: "#E8F0E6", border: "1px solid #A8C0A0" },
  PASS:   { color: "#9B2C2C", bg: "#FDF0F0", border: "1px solid #E8B0B0" },
  WATCH:  { color: "#92620A", bg: "#FFFBF0", border: "1px solid #E8D0A0" },
};

const card = { background: "#FFFFFF", border: "1px solid #C8C8C8", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" };
const label = { fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6B6B6B" };
const serif = (sz, color = "#2C2C2C") => ({ fontFamily: "Times New Roman, Times, serif", fontSize: sz, fontWeight: 700, color, margin: 0 });
const sans = (sz, color = "#4A4A4A") => ({ fontFamily: "Arial, sans-serif", fontSize: sz, color, margin: 0, lineHeight: 1.65 });

export default function Home() {
  const { state, reset, startResearch } = useResearch();
  const { status, report } = state;
  const isIdle = status === "idle";

  return (
    <div style={{ minHeight: "100vh", background: "#E2E2E2", display: "flex", flexDirection: "column" }}>
      {status === "loading" && <div className="progress-bar-top" />}

      {/* Header */}
      <header style={{ background: "#4E5944", borderBottom: "1px solid rgba(255,255,255,0.18)", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ ...W, display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 80, padding: "16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp style={{ width: 18, height: 18, color: "#fff" }} />
            </div>
            <div>
              <h1 style={{ ...serif(24, "#fff"), lineHeight: 1.05, letterSpacing: "0.08em" }}>ARIA</h1>
              <p style={{ ...sans(11, "rgba(255,255,255,0.8)"), textTransform: "uppercase", letterSpacing: "0.13em", marginTop: 4 }}>AI Research Intelligence Agent</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {["Platform", "Coverage", "Research"].map(n => (
                <span key={n} style={{ ...sans(12, "rgba(255,255,255,0.9)"), textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, cursor: "default" }}>{n}</span>
              ))}
            </nav>
            {status !== "idle" && (
              <button onClick={reset} className="corp-btn-outline" style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px" }}>
                <RotateCcw style={{ width: 14, height: 14 }} /> New Research
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">

          {/* ── IDLE ── */}
          {status === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>

              {/* Market Ticker removed per request */}

              {/* Hero */}
              <div style={{ ...W, padding: "48px 48px 0" }}>
                <div style={{ ...card, display: "flex", minHeight: 440 }}>
                  {/* Col 1 — headline */}
                  <div style={{ flex: "0 0 46%", padding: "40px 40px 40px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ ...label, marginBottom: 12 }}>Institutional Research Platform</p>
                    <h2 style={{ ...serif(52, "#2C2C2C"), lineHeight: 1.1, marginBottom: 16 }}>
                      Institutional-Grade<br />
                      <span style={{ color: "#4E5944" }}>Investment Intelligence</span>
                    </h2>
                    <p style={{ ...sans(15, "#5A5A5A"), maxWidth: 520, marginBottom: 28, lineHeight: 1.6 }}>
                      AI-powered research on any public company delivered in under 60 seconds. Built for serious investors who demand institutional-grade analysis.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {["Comprehensive financial metrics & price targets", "AI-powered buy/sell/hold verdicts with confidence scores", "Real-time news sentiment & competitor intelligence"].map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ width: 6, height: 6, background: "#4E5944", display: "inline-block", flexShrink: 0, marginTop: 6 }} />
                          <span style={{ ...sans(13, "#4A4A4A") }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, background: "#D0D0D0", flexShrink: 0 }} />

                  {/* Testimonial section removed per request */}

                  {/* Col 3 — live stats */}
                  <div style={{ flex: 1, padding: "40px 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
                    <p style={{ ...label, marginBottom: 16 }}>Platform Statistics</p>
                    {[
                      { val: "10,000+", lbl: "Companies Covered" },
                      { val: "50+",     lbl: "Global Exchanges" },
                      { val: "< 60s",   lbl: "Avg. Research Time" },
                      { val: "98.2%",   lbl: "Research Accuracy" },
                      { val: "Live",    lbl: "Market Data Feed" },
                      { val: "SEC / SEBI", lbl: "Filing Coverage" },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 5 ? "1px solid #E8E8E8" : "none" }}>
                        <span style={{ ...sans(12, "#6B6B6B"), fontWeight: 600 }}>{s.lbl}</span>
                        <span style={{ fontFamily: "Courier New, monospace", fontSize: 14, fontWeight: 700, color: "#4E5944" }}>{s.val}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 20, padding: "10px 12px", background: "#F0F7F0", border: "1px solid #A8C0A0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4E5944", animation: "pulse 2s ease-in-out infinite" }} />
                        <span style={{ ...sans(9, "#3a4333"), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Agents Active</span>
                      </div>
                      <p style={{ ...sans(10, "#6B6B6B"), margin: 0 }}>47 research queries processed in the last hour</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div style={{ ...W, padding: "40px 48px" }}>
                <SearchBar tall />
              </div>

              {/* Feature Cards */}
              <div style={{ ...W, padding: "0 48px 48px" }}>
                <p style={{ ...label, marginBottom: 20 }}>Platform Capabilities</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                  {FEATURES.map(({ Icon, title, desc }, i) => (
                    <div key={i} style={{ ...card, padding: "28px 24px", transition: "box-shadow 0.2s, transform 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "none"; }}>
                      <div style={{ width: 40, height: 40, background: "#F0F7F0", border: "1px solid #A8C0A0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <Icon style={{ width: 18, height: 18, color: "#4E5944" }} />
                      </div>
                      <p style={{ ...serif(15, "#2C2C2C"), marginBottom: 10 }}>{title}</p>
                      <p style={{ ...sans(13, "#6B6B6B"), lineHeight: 1.65 }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why ARIA */}
              <div style={{ background: "#4E5944", padding: "56px 0" }}>
                <div style={{ ...W }}>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>Why Choose ARIA</p>
                  <h3 style={{ ...serif(34, "#fff"), marginBottom: 40, maxWidth: 600, lineHeight: 1.2 }}>The research platform built for institutional investors</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.1)" }}>
                    {WHY.map(({ Icon, title, desc }, i) => (
                      <div key={i} style={{ background: "#4E5944", padding: "32px 28px" }}>
                        <Icon style={{ width: 22, height: 22, color: "rgba(255,255,255,0.75)", marginBottom: 14 }} />
                        <p style={{ ...serif(16, "#fff"), marginBottom: 10 }}>{title}</p>
                        <p style={{ ...sans(13, "rgba(255,255,255,0.65)"), lineHeight: 1.7 }}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research Coverage section removed per request */}

              {/* Sample Research */}
              <div style={{ background: "#F5F5F3", borderTop: "1px solid #D8D8D8", borderBottom: "1px solid #D8D8D8", padding: "52px 0" }}>
                <div style={{ ...W }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
                    <p style={{ ...label }}>Recent Research Examples</p>
                    <span style={{ ...sans(12, "#6B6B6B") }}>Click any card to run a live report</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
                    {SAMPLES.map((s, i) => {
                      const vs = VS[s.verdict] ?? VS.WATCH;
                      return (
                        <div key={i} style={{ ...card, padding: "22px 20px", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
                          onClick={() => startResearch(s.co, "medium")}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "none"; }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div>
                              <p style={{ fontFamily: "Courier New, monospace", fontSize: 13, fontWeight: 700, color: "#4E5944", margin: "0 0 2px" }}>{s.ticker}</p>
                              <p style={{ ...sans(10, "#6B6B6B"), margin: 0 }}>{s.ex}</p>
                            </div>
                            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 700, padding: "3px 8px", textTransform: "uppercase", letterSpacing: "0.06em", ...vs }}>{s.verdict}</span>
                          </div>
                          <p style={{ ...serif(14, "#2C2C2C"), marginBottom: 12, lineHeight: 1.3 }}>{s.co}</p>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                              <span style={{ ...sans(10, "#6B6B6B") }}>AI Score</span>
                              <span style={{ fontFamily: "Courier New, monospace", fontSize: 11, fontWeight: 700, color: "#4E5944" }}>{s.score}/100</span>
                            </div>
                            <div style={{ height: 4, background: "#E8E8E8" }}>
                              <div style={{ height: "100%", background: "#4E5944", width: `${s.score}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Trusted By */}
              <div style={{ ...W, padding: "44px 48px", textAlign: "center" }}>
                <p style={{ ...label, marginBottom: 24 }}>Trusted By Leading Financial Institutions</p>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 32px" }}>
                  {["Citadel Securities", "Two Sigma", "BlackRock", "Vanguard", "Renaissance Tech", "Bridgewater", "AQR Capital", "D.E. Shaw"].map(n => (
                    <span key={n} style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 16, fontWeight: 700, color: "#AAAAAA", letterSpacing: "0.02em" }}>{n}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {status === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: "32px 0" }}>
              <div style={{ maxWidth: 760, margin: "0 auto 24px", padding: "0 24px" }}><SearchBar compact /></div>
              <AgentProgress />
            </motion.div>
          )}

          {/* ── COMPLETE ── */}
          {status === "complete" && report && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: "32px 0" }}>
              <div style={{ maxWidth: 760, margin: "0 auto 24px", padding: "0 24px" }}><SearchBar compact /></div>
              <AgentProgress />
              <VerdictCard report={report} />
              <KeyInsightsPanel financialData={report.financialData} sentimentScore={report.sentimentScore} riskFactors={report.riskFactors} positiveFactors={report.positiveFactors} />
              <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {(report.reportSections ?? []).map((s, i) => <ReportSection key={s.id} section={s} index={i} />)}
                </div>
                <div><ResearchSidebar report={report} streamEvents={state.streamEvents} /></div>
              </div>
              <div style={{ marginTop: 32 }}><ReasoningTrace /></div>
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {status === "error" && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", padding: 40 }}>
              <div style={{ maxWidth: 480, width: "100%", ...card, borderLeft: "4px solid #9B2C2C", padding: 40, textAlign: "center" }}>
                <AlertCircle style={{ width: 40, height: 40, color: "#9B2C2C", margin: "0 auto 16px" }} />
                <h2 style={{ ...serif(22, "#2C2C2C"), marginBottom: 8 }}>Research Failed</h2>
                <p style={{ ...sans(14, "#9B2C2C"), marginBottom: 24, lineHeight: 1.6 }}>{state.error}</p>
                <button onClick={reset} className="corp-btn-primary" style={{ width: "100%" }}>Try Again</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ background: "#4E5944", borderTop: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 -10px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ ...W, display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 72, padding: "18px 0" }}>
          <span style={{ ...serif(16, "#fff"), letterSpacing: "0.12em" }}>ARIA</span>
          <span style={{ ...sans(12, "rgba(255,255,255,0.75)"), letterSpacing: "0.06em", maxWidth: 600, textAlign: "right" }}>AI-Powered Investment Research · For informational purposes only</span>
        </div>
      </footer>
    </div>
  );
}
