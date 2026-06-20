import "../config/env.js";
import express from "express";
import Flutterwave from "flutterwave-node-v3";
import { db } from "../services/firebase.js";
import { sendEmail } from "../services/resendService.js";

const router = express.Router();


const FRONTEND_URL = process.env.FRONTEND_URL || "https://paidsafe.vercel.app";

const getFlw = () => {
  if (!process.env.FLUTTERWAVE_PUBLIC_KEY || !process.env.FLUTTERWAVE_SECRET_KEY) {
    throw new Error("Flutterwave keys are not configured");
  }
  return new Flutterwave(
    process.env.FLUTTERWAVE_PUBLIC_KEY,
    process.env.FLUTTERWAVE_SECRET_KEY
  );
};


router.post("/initiate", async (req, res) => {
  try {
    const {
      contractId,
      milestoneId,
      amount,
      email,
      name,
      currency = "NGN"
    } = req.body;

    if (!contractId || !milestoneId || !amount || !email) {
      return res.status(400).json({
        error: "contractId, milestoneId, amount, and email are required"
      });
    }

    const txRef = `PS-${contractId}-${milestoneId}-${Date.now()}`;

    const payload = {
      tx_ref: txRef,
      amount,
      currency,
      redirect_url: `${FRONTEND_URL}/payment/callback`,
      customer: {
        email,
        name: name || email
      },
      meta: {
        contractId,
        milestoneId
      },
      customizations: {
        title: "PaidSafe Milestone Payment",
        description: `Payment for milestone ${milestoneId}`
      }
    };

    const response = await getFlw().Payment.initialize(payload);

    if (response.status === "success") {
      return res.json({
        paymentLink: response.data.link
      });
    }

    return res.status(500).json({
      error: "Payment initiation failed"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Payment initiation failed"
    });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const hash = req.headers["verif-hash"];

    if (!hash || hash !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const event = req.body;

    if (event.event === "charge.completed" && event.data?.status === "successful") {
      const { contractId, milestoneId } = event.data.meta;
      const flwReference = event.data.flw_ref;
      const amount = event.data.amount;

      await db.collection("payments").add({
        contractId,
        milestoneId,
        flwReference,
        amount,
        status: "FUNDED",
        paidAt: new Date()
      });

      await db
        .collection("contracts")
        .doc(contractId)
        .collection("milestones")
        .doc(milestoneId)
        .update({ status: "FUNDED" });

      const contractDoc = await db.collection("contracts").doc(contractId).get();
      if (contractDoc.exists) {
        const contractData = contractDoc.data();
        const contractTitle = contractData.title || "your contract";

        if (contractData.status === "PENDING_CLIENT") {
          await db.collection("contracts").doc(contractId).update({ status: "ACTIVE" });
        }

        let freelancerEmail = null;
        if (contractData.freelancerId) {
          try {
            const userDoc = await db.collection("users").doc(contractData.freelancerId).get();
            if (userDoc.exists) {
              freelancerEmail = userDoc.data().email || null;
            }
          } catch {
            console.warn("[payments] Could not fetch freelancer email");
          }
        }

        if (freelancerEmail) {
          await sendEmail(
            freelancerEmail,
            "Your client has funded a milestone",
            `<p>Hi,</p>
            <p>Great news! Your client has deposited funds into escrow for a milestone on <strong>${contractTitle}</strong>.</p>
            <p>You can now begin work on this milestone. Once complete, mark it as done from your dashboard:</p>
            <p><a href="${FRONTEND_URL}/dashboard" style="color:#6C63FF">${FRONTEND_URL}/dashboard</a></p>
            <p>Funds will be released to you once your client approves your work.</p>
            <p>— The PaidSafe Team</p>`
          );
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;
