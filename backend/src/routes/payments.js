import express from "express";

const router = express.Router();

/**

* POST /api/payments/initiate
  */
  router.post("/initiate", (req, res) => {
  res.json({
  paymentLink: "https://checkout.flutterwave.com/mock-payment-link"
  });
  });

/**

* POST /api/payments/webhook
  */
  router.post("/webhook", (req, res) => {
  res.status(200).json({
  received: true
  });
  });

export default router;
