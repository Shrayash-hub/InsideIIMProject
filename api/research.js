import "dotenv/config";
import serverless from "serverless-http";
import express from "express";
import researchRouter from "../server/src/routes/research.js";
import { validateApiKeys } from "../server/src/lib/llm.js";

validateApiKeys();

const app = express();
app.use(express.json());
app.use("/", researchRouter);

export default serverless(app);
