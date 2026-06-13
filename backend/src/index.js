import "./config/env.js";
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import "./services/firebase.js";
import rateLimiter from "./middleware/rateLimiter.js";
import contractsRoutes from "./routes/contracts.js";
import milestonesRoutes from "./routes/milestones.js";
import paymentsRoutes from "./routes/payments.js";
import aiRoutes from "./routes/ai.js";
import errorHandler from "./middleware/errorHandler.js";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use("/api/contracts", contractsRoutes);
app.use("/api/milestones", milestonesRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => {
res.json({
status: "ok",
service: "PaidSafe API",
});
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
console.log("PROJECT ID:", process.env.FIREBASE_PROJECT_ID);

});
