import express from "express";

const router = express.Router();

router.post("/draft", (req, res) => {
  res.redirect(301, "/api/contracts/draft");
});

export default router;
