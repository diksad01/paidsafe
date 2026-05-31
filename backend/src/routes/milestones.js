import express from "express";

const router = express.Router();

/**

* PATCH /api/milestones/:id/complete
  */
  router.patch("/:id/complete", (req, res) => {
  res.json({
  success: true,
  message: "Milestone marked complete"
  });
  });

/**

* PATCH /api/milestones/:id/approve
  */
  router.patch("/:id/approve", (req, res) => {
  res.json({
  success: true,
  message: "Milestone approved"
  });
  });

/**

* PATCH /api/milestones/:id/dispute
  */
  router.patch("/:id/dispute", (req, res) => {
  res.json({
  success: true,
  message: "Milestone disputed"
  });
  });

export default router;
