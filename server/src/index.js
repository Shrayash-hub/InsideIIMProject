import "dotenv/config";
import express from "express";
import cors from "cors";
import researchRouter from "./routes/research.js";
import { validateApiKeys } from "./lib/llm.js";

validateApiKeys();

const requiredEnvVars = ["GROQ_API_KEY", "GOOGLE_API_KEY", "CEREBRAS_API_KEY", "TAVILY_API_KEY"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]?.trim());
if (missingVars.length > 0) {
  console.warn(`[WARN] Missing env vars: ${missingVars.join(", ")}`);
  console.warn("[WARN] Some LLM fallbacks may not work. Check your .env file.");
}
const app = express();
const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.use("/api/research", researchRouter);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  if (!res.headersSent) {
    res.status(500).json({ error: err.message ?? "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Investment Research Agent server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${CLIENT_URL}`);
});
