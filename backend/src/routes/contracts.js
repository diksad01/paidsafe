import express from "express";
import { db } from "../services/firebase.js";
import authMiddleware from "../middleware/auth.js";
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
  router.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      clientEmail,
      milestones,
      totalAmount
    } = req.body;

    const contractRef = await db.collection("contracts").add({
      title,
      clientEmail,
      totalAmount,
      freelancerId: req.user.uid,
      status: "PENDING_CLIENT",
      createdAt: new Date()
    });

    if (milestones && milestones.length > 0) {
      for (const milestone of milestones) {
        await contractRef.collection("milestones").add({
          title: milestone.title,
          amount: milestone.amount,
          status: "PENDING",
          createdAt: new Date()
        });
      }
    }

    res.status(201).json({
      contractId: contractRef.id
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create contract"
    });
  }
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
