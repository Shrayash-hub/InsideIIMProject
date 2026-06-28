import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BarChart3,
  Newspaper,
  Globe,
  Users,
  Brain,
  Gavel,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useResearchContext } from "../context/ResearchContext.jsx";
import { cn, formatElapsed } from "../lib/utils.js";

const STEPS = [
  { id: "tickerResolver", label: "Resolving Ticker", icon: Search, parallel: false },
  { id: "financialData", label: "Fetching Financial Data", icon: BarChart3, parallel: true },
  { id: "newsSentiment", label: "Analyzing News", icon: Newspaper, parallel: true },
  { id: "webResearch", label: "Web Research", icon: Globe, parallel: true },
  { id: "competitorAnalysis", label: "Competitor Analysis", icon: Users, parallel: true },
  { id: "analyst", label: "AI Analysis", icon: Brain, parallel: false },
  { id: "decision", label: "Final Decision", icon: Gavel, parallel: false },
];

const NODE_ORDER = STEPS.map((s) => s.id);

function getStepStatus(stepId, events, isComplete) {
  const stepEvents = events.filter((e) => e.node === stepId);
  if (stepEvents.some((e) => e.type === "error")) return "error";
  if (stepEvents.some((e) => e.type === "node_complete")) return "complete";
  if (stepEvents.some((e) => e.type === "node_start")) return "running";
  if (isComplete) return "complete";

  const stepIndex = NODE_ORDER.indexOf(stepId);
  const runningIndex = NODE_ORDER.findIndex((id) => {
    const evts = events.filter((e) => e.node === id);
    return evts.some((e) => e.type === "node_start") && !evts.some((e) => e.type === "node_complete");
  });

  if (runningIndex > stepIndex) return "complete";
  if (runningIndex === stepIndex) return "running";

  const completedSteps = NODE_ORDER.filter((id) =>
    events.some((e) => e.node === id && e.type === "node_complete")
  );
  const lastCompleted =
    completedSteps.length > 0
      ? NODE_ORDER.indexOf(completedSteps[completedSteps.length - 1])
      : -1;

  if (lastCompleted >= stepIndex) return "complete";
  return "pending";
}

function StepCircle({ status, Icon }) {
  if (status === "running") {
    return (
      <div style={{ position: "relative", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid #4E5944",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <div style={{ width: 24, height: 24, background: "#4E5944", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon style={{ width: 12, height: 12, color: "#FFFFFF" }} />
        </div>
      </div>
    );
  }
  if (status === "complete") {
    return (
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4E5944", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check style={{ width: 14, height: 14, color: "#FFFFFF" }} />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#9B2C2C", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X style={{ width: 14, height: 14, color: "#FFFFFF" }} />
      </div>
    );
  }
  return (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F0F0F0", border: "1px solid #C8C8C8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon style={{ width: 13, height: 13, color: "#A0A0A0" }} />
    </div>
  );
}

function StepItem({ step, events, isComplete, isLast = false }) {
  const status = getStepStatus(step.id, events, isComplete);
  const Icon = step.icon;
  const stepEvents = events.filter((e) => e.node === step.id);
  const startEvt = stepEvents.find((e) => e.type === "node_start");
  const endEvt = stepEvents.find((e) => e.type === "node_complete" || e.type === "error");
  const elapsed =
    startEvt && endEvt
      ? formatElapsed(startEvt.timestamp, endEvt.timestamp)
      : startEvt
        ? formatElapsed(startEvt.timestamp)
        : "";

  const toolCalls = stepEvents.filter((e) => e.type === "tool_call");

  return (
    <div style={{ display: "flex", gap: 12, position: "relative", minWidth: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <StepCircle status={status} Icon={Icon} />
        {!isLast && (
          <div style={{ width: 1, flex: 1, background: "#D0D0D0", minHeight: 24, marginTop: 4 }} />
        )}
      </div>
      <div style={{ flex: 1, paddingBottom: 20, minWidth: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, minWidth: 0 }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 600, fontSize: 13, color: "#2C2C2C" }}>
            {step.label}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {elapsed && (
              <span style={{ fontFamily: "Courier New, monospace", fontSize: 10, color: "#6B6B6B", background: "#F0F0F0", border: "1px solid #D0D0D0", padding: "1px 6px" }}>
                {elapsed}
              </span>
            )}
            {status === "complete" && (
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: 10, background: "#E8F0E6", color: "#3a4333", border: "1px solid #A8C0A0", padding: "1px 7px", fontWeight: 600 }}>
                Done
              </span>
            )}
            {status === "error" && (
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: 10, background: "#FDF0F0", color: "#9B2C2C", border: "1px solid #E8B0B0", padding: "1px 7px", fontWeight: 600 }}>
                Error
              </span>
            )}
          </div>
        </div>
        {toolCalls.length > 0 && (
          <div style={{ marginTop: 6, paddingLeft: 4 }}>
            {toolCalls.map((evt, i) => (
              <p key={i} style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: "#888", fontStyle: "italic", margin: "2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                🔍 {evt.message}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentProgress() {
  const { state } = useResearchContext();
  const [collapsed, setCollapsed] = useState(false);
  const isComplete = state.status === "complete";
  const events = state.streamEvents;

  const { sequentialSteps, parallelSteps } = useMemo(() => {
    const sequential = STEPS.filter((s) => !s.parallel);
    const parallel = STEPS.filter((s) => s.parallel);
    return { sequentialSteps: sequential, parallelSteps: parallel };
  }, []);

  if (isComplete && collapsed) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "8px 24px" }}>
        <button
          onClick={() => setCollapsed(false)}
          style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Arial, sans-serif", fontSize: 12, color: "#6B6B6B", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em" }}
        >
          <ChevronDown style={{ width: 14, height: 14 }} />
          Show Agent Trace
        </button>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 760, margin: "0 auto", padding: "24px" }}
    >
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 16, padding: "10px 16px", background: "#E8F0E6", border: "1px solid #A8C0A0", borderLeft: "3px solid #4E5944", fontFamily: "Arial, sans-serif", fontSize: 13, color: "#3a4333", textAlign: "center" }}
          >
            Research Complete — Scroll down for results ↓
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6B6B6B", margin: 0 }}>
          {isComplete ? "Agent Trace" : `Researching ${state.companyName}…`}
        </h3>
        {isComplete && (
          <button
            onClick={() => setCollapsed(true)}
            style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Arial, sans-serif", fontSize: 11, color: "#6B6B6B", background: "none", border: "none", cursor: "pointer" }}
          >
            <ChevronUp style={{ width: 14, height: 14 }} />
            Collapse
          </button>
        )}
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #C8C8C8", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 20 }}>
        <StepItem
          step={sequentialSteps[0]}
          events={events}
          isComplete={isComplete}
        />

        <div style={{ margin: "8px 0 8px 16px", border: "1px dashed #C8C8C8", background: "#FAFAFA", padding: 16 }}>
          <p style={{ fontFamily: "Arial, sans-serif", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", color: "#4E5944", fontWeight: 700, marginBottom: 12 }}>
            Parallel Research
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px", overflow: "hidden" }}>
            {parallelSteps.map((step, i) => (
              <StepItem
                key={step.id}
                step={step}
                events={events}
                isComplete={isComplete}
                isLast={i >= parallelSteps.length - 2}
              />
            ))}
          </div>
        </div>

        {sequentialSteps.slice(1).map((step, i, arr) => (
          <StepItem
            key={step.id}
            step={step}
            events={events}
            isComplete={isComplete}
            isLast={i === arr.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
