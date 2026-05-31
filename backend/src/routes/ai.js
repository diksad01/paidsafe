import express from "express";

const router = express.Router();

/**

* POST /api/ai/draft
  */
  router.post("/draft", (req, res) => {
  const { description } = req.body;

res.json({
description,
milestones: [
{
title: "Design Phase",
amount: 50000,
deadline: "7 days"
},
{
title: "Development Phase",
amount: 100000,
deadline: "14 days"
}
],
totalAmount: 150000,
currency: "NGN"
});
});

export default router;
