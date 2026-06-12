import "../config/env.js";
import express from "express";
import Flutterwave from "flutterwave-node-v3";
import { db } from "../services/firebase.js";

const router = express.Router();


console.log("PUBLIC KEY:", process.env.FLUTTERWAVE_PUBLIC_KEY);
console.log("SECRET KEY EXISTS:", !!process.env.FLUTTERWAVE_SECRET_KEY);
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

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
      redirect_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/callback`,
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

    const response = await flw.Payment.initialize(payload);

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
      return res.status(401).json({
        error: "Unauthorized"
      });
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
        .update({
          status: "FUNDED"
        });
    }

    return res.status(200).json({
      received: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Webhook processing failed"
    });
  }
});

export default router;
