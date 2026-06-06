import express from "express";
import { db } from "../services/firebase.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();



/**

* PATCH /api/milestones/:id/complete
  */
  router.patch("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const milestoneId = req.params.id;
    const { contractId, proofUrl } = req.body;

    await db
      .collection("contracts")
      .doc(contractId)
      .collection("milestones")
      .doc(milestoneId)
      .update({
        status: "COMPLETE",
        proofUrl,
        completedAt: new Date()
      });

    res.json({
      success: true
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to complete milestone"
    });
  }
});

/**

* PATCH /api/milestones/:id/approve
  */
  router.patch("/:id/approve", async (req, res) => {
  try {
    const milestoneId = req.params.id;
    const { contractId } = req.body;

    await db
      .collection("contracts")
      .doc(contractId)
      .collection("milestones")
      .doc(milestoneId)
      .update({
        status: "APPROVED",
        approvedAt: new Date()
      });

    res.json({
      success: true
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to approve milestone"
    });
  }
});
/**

* PATCH /api/milestones/:id/dispute
  */
  router.patch("/:id/dispute", async (req, res) => {
  try {
    const milestoneId = req.params.id;
    const { contractId } = req.body;

    await db
      .collection("contracts")
      .doc(contractId)
      .collection("milestones")
      .doc(milestoneId)
      .update({
        status: "DISPUTED",
        disputedAt: new Date()
      });

    res.json({
      success: true
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to dispute milestone"
    });
  }
});

export default router;
