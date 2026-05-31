import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import "./services/firebase.js";

import contractsRoutes from "./routes/contracts.js";
import milestonesRoutes from "./routes/milestones.js";
import paymentsRoutes from "./routes/payments.js";
import aiRoutes from "./routes/ai.js";

import errorHandler from "./middleware/errorHandler.js";
const app = express();
app.use(errorHandler);

app.use(cors());
app.use(express.json());
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
console.log("PROJECT ID:", process.env.FIREBASE_PROJECT_ID);

});
