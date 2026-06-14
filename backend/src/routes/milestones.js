import express from "express";
import { db } from "../services/firebase.js";
import authMiddleware from "../middleware/auth.js";
import { sendEmail } from "../services/resendService.js";

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "https://paidsafe.vercel.app";

const getContractParties = async (contractId) => {
  const contractDoc = await db.collection("contracts").doc(contractId).get();
  if (!contractDoc.exists) return { clientEmail: null, freelancerEmail: null, contractTitle: "" };
  const data = contractDoc.data();
  const clientEmail = data.clientEmail || null;
  const contractTitle = data.title || "your contract";
  let freelancerEmail = null;
  if (data.freelancerId) {
    try {
      const userDoc = await db.collection("users").doc(data.freelancerId).get();
      if (userDoc.exists) {
        freelancerEmail = userDoc.data().email || null;
      }
    } catch {
      console.warn("[milestones] Could not fetch freelancer email");
    }
  }
  return { clientEmail, freelancerEmail, contractTitle };
};

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
        status: "AWAITING_APPROVAL",
        proofUrl: proofUrl || null,
        completedAt: new Date(),
      });

    const { clientEmail, contractTitle } = await getContractParties(contractId);
    const contractLink = `${FRONTEND_URL}/contract/${contractId}/client`;

    if (clientEmail) {
      await sendEmail(
        clientEmail,
        "A milestone is ready for your review",
        `<p>Hi,</p>
        <p>The freelancer has marked a milestone as complete on the contract <strong>${contractTitle}</strong>.</p>
        <p>Please review the work and approve or raise a dispute:</p>
        <p><a href="${contractLink}" style="color:#6C63FF">${contractLink}</a></p>
        <p>Once you approve, payment will be released from escrow to the freelancer.</p>
        <p>— The PaidSafe Team</p>`
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to complete milestone" });
  }
});

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
        status: "RELEASED",
        releasedAt: new Date(),
      });

    console.log(`[milestones] Milestone ${milestoneId} approved — real Flutterwave transfer pending`);

    const { freelancerEmail, contractTitle } = await getContractParties(contractId);

    if (freelancerEmail) {
      await sendEmail(
        freelancerEmail,
        "Payment released",
        `<p>Hi,</p>
        <p>Great news! Your client has approved a milestone on <strong>${contractTitle}</strong> and your payment has been released from escrow.</p>
        <p>Check your contract dashboard for details:</p>
        <p><a href="${FRONTEND_URL}/dashboard" style="color:#6C63FF">${FRONTEND_URL}/dashboard</a></p>
        <p>— The PaidSafe Team</p>`
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to approve milestone" });
  }
});

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
        disputedAt: new Date(),
      });

    const { clientEmail, freelancerEmail, contractTitle } = await getContractParties(contractId);
    const contractLink = `${FRONTEND_URL}/contract/${contractId}/client`;

    const disputeBody = (recipient) =>
      `<p>Hi,</p>
      <p>A dispute has been raised on a milestone for the contract <strong>${contractTitle}</strong>.</p>
      <p>Our team will review within 48 hours. Please be available to provide any supporting information.</p>
      <p>Contract link: <a href="${contractLink}" style="color:#6C63FF">${contractLink}</a></p>
      <p>— The PaidSafe Team</p>`;

    if (clientEmail) {
      await sendEmail(clientEmail, "A milestone has been disputed", disputeBody("client"));
    }
    if (freelancerEmail) {
      await sendEmail(freelancerEmail, "A milestone has been disputed", disputeBody("freelancer"));
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to dispute milestone" });
  }
});

export default router;
