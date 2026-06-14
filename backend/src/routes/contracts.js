import express from "express";
import { db } from "../services/firebase.js";
import authMiddleware from "../middleware/auth.js";
import axios from "axios";
import { sendEmail } from "../services/resendService.js";

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "https://paidsafe.vercel.app";




router.post("/draft", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        error: "Job description is required"
      });
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription.length < 10) {
      return res.status(400).json({
        error: "Please provide a more detailed job description"
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1",
        messages: [
          {
            role: "system",
            content:
              "You are a contract generator for freelancers. Always return ONLY valid JSON with this structure: { milestones: [{ title: string, amount: number }], totalAmount: number, currency: string }. Do not include any explanation text."
          },
          {
            role: "user",
            content: trimmedDescription
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = response.data.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: aiText
      });
    }

    res.json(parsed);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate contract with AI"
    });
  }
});
/* POST /api/contracts/create
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

    const contractLink = `${FRONTEND_URL}/contract/${contractRef.id}/client`;

    await sendEmail(
      clientEmail,
      "You have a new contract on PaidSafe",
      `<p>Hi,</p>
      <p>A freelancer has sent you a contract titled <strong>${title}</strong> on PaidSafe.</p>
      <p>PaidSafe is a secure escrow platform that protects both parties — your payment is held safely until you approve the work delivered.</p>
      <p>Review the contract and pay your first milestone here:</p>
      <p><a href="${contractLink}" style="color:#6C63FF;font-weight:bold">${contractLink}</a></p>
      <p>You do not need to create an account — just open the link.</p>
      <p>— The PaidSafe Team</p>`
    );

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




 router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const snapshot = await db
      .collection("contracts")
      .where("freelancerId", "==", uid)
      .get();

    const contracts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      contracts
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch contracts"
    });
  }
});


/*GET /api/contracts/:id*/
  
  router.get("/:id", async (req, res) => {
  try {
    const contractId = req.params.id;

    const contractDoc = await db
      .collection("contracts")
      .doc(contractId)
      .get();

    if (!contractDoc.exists) {
      return res.status(404).json({
        error: "Contract not found"
      });
    }

    const milestonesSnapshot = await db
      .collection("contracts")
      .doc(contractId)
      .collection("milestones")
      .get();

    const milestones = milestonesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      id: contractDoc.id,
      ...contractDoc.data(),
      milestones
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch contract"
    });
  }
});
  

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const contractId = req.params.id;

    const contractDoc = await db.collection("contracts").doc(contractId).get();

    if (!contractDoc.exists) {
      return res.status(404).json({ error: "Contract not found" });
    }

    if (contractDoc.data().freelancerId !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const milestonesSnapshot = await db
      .collection("contracts")
      .doc(contractId)
      .collection("milestones")
      .get();

    const batch = db.batch();
    milestonesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    batch.delete(db.collection("contracts").doc(contractId));
    await batch.commit();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete contract" });
  }
});

export default router;
