import express from "express";

const router = express.Router();

/**

* POST /api/contracts/draft
* Mock AI contract generation
  */
  router.post("/draft", (req, res) => {
  res.json({
  milestones: [
  { title: "Design", amount: 50000 },
  { title: "Development", amount: 100000 }
  ],
  totalAmount: 150000,
  currency: "NGN"
  });
  });

/**

* POST /api/contracts/create
  */
  router.post("/create", (req, res) => {
  res.json({
  contractId: "mock_contract_123"
  });
  });

/**

* GET /api/contracts/:id
  */
  router.get("/:id", (req, res) => {
  res.json({
  id: req.params.id,
  title: "Mock Contract",
  status: "ACTIVE",
  milestones: []
  });
  });

/**

* GET /api/contracts/user/:uid
  */
  router.get("/user/:uid", (req, res) => {
  res.json({
  contracts: []
  });
  });

export default router;
